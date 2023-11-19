import N3 from 'n3';
import NS from 'solid-namespace';

import { findStorage } from '@renyuneyun/solid-helper';

const { namedNode, literal } = N3.DataFactory;

const ns = NS(N3.DataFactory);

export enum ProfileStateEnum {
  SyntaxIsCorrect,
  ContainsStorage,
}

export type ProfileStatus = { [key in ProfileStateEnum]: boolean };
export type PartialProfileStatus = { [key in ProfileStateEnum]?: boolean };

export const DEFAULT_PROFILE_STATUS: ProfileStatus = {
  [ProfileStateEnum.SyntaxIsCorrect]: false,
  [ProfileStateEnum.ContainsStorage]: false,
};

export async function checkProfileStatus(
  webId: string
): Promise<ProfileStatus> {
  const profileBaseUrl = webId.substring(0, webId.indexOf('#'));
  const ret = { ...DEFAULT_PROFILE_STATUS };
  const parser = new N3.Parser({
    baseIRI: profileBaseUrl,
  });
  const store = new N3.Store();
  const resp = await fetch(webId);
  const webIdDoc = await resp.text();
  try {
    const quads = parser.parse(webIdDoc);
    store.addQuads(quads);
    ret[ProfileStateEnum.SyntaxIsCorrect] = true;
  } catch {}
  console.log(
    'Storage predicate:',
    ns.space('storage'),
    ns.space('storage').id
  );
  const quads = store.getQuads(null, null, null, null);
  console.log('Quads:', quads);
  const objects = store.getObjects(namedNode(webId), ns.space('Storage'), null);
  console.log('Objects:', objects);
  if (objects) {
    ret[ProfileStateEnum.ContainsStorage] = true;
  }
  return ret;
}

export interface FixProfileOut {
  document: string;
  newStatus: PartialProfileStatus;
}

export async function fixProfile(
  webId: string,
  current: ProfileStatus,
  goal: PartialProfileStatus
): Promise<FixProfileOut> {
  const profileBaseUrl = webId.substring(0, webId.indexOf('#'));
  const newStatus: PartialProfileStatus = {};
  const parser = new N3.Parser({
    baseIRI: profileBaseUrl,
  });
  const prefixes = {};
  const store = new N3.Store();
  const resp = await fetch(webId);
  const webIdDoc = await resp.text();
  const quads = parser.parse(webIdDoc, undefined, (prefix, prefixNode) => {
    Object.assign(prefixes, { [prefix]: prefixNode.value });
  });
  store.addQuads(quads);
  console.log('Goal:', goal);
  if (goal[ProfileStateEnum.ContainsStorage]) {
    const storage = await findStorage(profileBaseUrl);
    console.log('Storage:', storage);
    if (storage) {
      // TODO: Resolve to relative URL before adding
      store.addQuad(namedNode(webId), ns.space('Storage'), namedNode(storage));
      newStatus[ProfileStateEnum.ContainsStorage] = true;
    }
  }
  const writer = new N3.Writer({ prefixes: prefixes });
  writer.addQuads(store.getQuads(null, null, null, null));

  const newDocument: string = await new Promise((resolve, reject) => {
    writer.end((error, result) => {
      resolve(result);
    });
  });

  return {
    document: newDocument,
    newStatus: newStatus,
  };
}
