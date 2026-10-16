export function profileSkillValues(skills, fieldNames) {
  const normalize = (value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^medicalaid$/, 'medical').replace(/^counselling$/, 'counseling');
  const known = new Map(fieldNames.map((field) => [normalize(field.replace('pf-skill-','')), field]));
  const checks = Object.fromEntries(fieldNames.map((field) => [field,false]));
  const custom = [];
  for (const skill of Array.isArray(skills) ? skills : []) {
    const field = known.get(normalize(skill));
    if (field) checks[field] = true;
    else if (!custom.some((item) => normalize(item) === normalize(skill))) custom.push(skill);
  }
  return { checks, custom };
}
