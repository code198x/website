// Synthetic federation demonstration: no real-world historical claim is made here.
// Independent publishers own their assertion IDs; consumers retain disagreement.
export function combinePublisherGraphs(documents) {
  const nodes = new Map();
  for (const document of documents) {
    if (!Array.isArray(document?.['@graph'])) throw Error('Invalid publisher graph');
    for (const node of document['@graph']) {
      if (typeof node?.['@id'] !== 'string' || !/^https:\/\//.test(node['@id'])) throw Error('Invalid publisher node ID');
      const existing = nodes.get(node['@id']);
      if (existing && JSON.stringify(existing) !== JSON.stringify(node)) {
        throw Error('Conflicting definitions for identical node ID');
      }
      nodes.set(node['@id'], node);
    }
  }
  return { '@graph': [...nodes.values()] };
}

export function syntheticPublisherClaim({ publisher, year, subject }) {
  if (!/^https:\/\/[a-z0-9.-]+\/$/.test(publisher)) throw Error('Invalid publisher namespace');
  if (!Number.isInteger(year) || year < 1800 || year > 2100) throw Error('Invalid year');
  if (typeof subject !== 'string' || !/^https:\/\//.test(subject)) throw Error('Invalid subject');
  const id = publisher + 'claims/spectrum-introduced-' + year;
  return { '@graph': [{
    '@id': id,
    '@type': 'https://code198x.com/ns/semantic#HistoricalAssertion',
    'https://code198x.com/ns/semantic#subject': { '@id': subject },
    'https://code198x.com/ns/semantic#predicate': { '@id': 'https://code198x.com/ns/semantic#introduced' },
    'https://code198x.com/ns/semantic#year': { '@value': String(year), '@type': 'http://www.w3.org/2001/XMLSchema#gYear' },
    'https://code198x.com/ns/semantic#publisher': { '@id': publisher },
  }] };
}
