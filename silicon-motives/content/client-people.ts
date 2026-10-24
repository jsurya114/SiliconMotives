/** Client portraits supplied by the site owner; no job titles or quotes inferred. */
export const clientPeople = [
  { name: 'Gokul', company: 'Woobe', image: '/brand/logos/png/gokul-woobe.png', position: '50% 25%' },
  { name: 'Navas', company: 'Picbox', image: '/brand/logos/png/Navas-pickbox.png', position: '50% 25%' },
  { name: 'NM Jaseem', company: 'Uniwayin', image: '/brand/logos/png/NM-jaseem-Uniwayin.png', position: '50% 0%' },
] as const;

const key = (value: unknown) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const clientCompanyKey = (value: unknown) => key(value).replace(/^pickbox$/, 'picbox');

export function clientPortrait(name: unknown, company: unknown) {
  return clientPeople.find(person => key(person.name) === key(name) && clientCompanyKey(person.company) === clientCompanyKey(company));
}
