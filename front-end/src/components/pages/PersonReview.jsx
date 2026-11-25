const fields = [
  ['name','Name'], ['email','Email'], ['phone','Phone'], ['role','Account / volunteer role'],
  ['org','Organization'], ['status','Status'], ['bio','About'], ['location','Home location'],
  ['age','Age'], ['skills','Skills'], ['joined','Joined'], ['hours','Recorded service hours'],
  ['rating','Average rating (out of 5)'], ['availableNow','Available now'], ['currentLocation','Current location'],
  ['locationUpdatedAt','Location last updated'], ['availableFrom','Available from'],
  ['availableUntil','Available until'], ['availabilityDays','Available weekdays'],
  ['serviceAreas','Service areas'], ['willingToTravel','Willing to travel'], ['verificationStatus','Verification status'],
];
const display = value => value === undefined || value === null || value === '' || Array.isArray(value) && !value.length
  ? 'Not provided' : typeof value === 'boolean' ? value ? 'Yes' : 'No' : Array.isArray(value) ? value.join(', ') : String(value);

export default function PersonReview({ detail }) {
  return <>
    {detail.application && <section aria-label="Application details"><h4>Application</h4><dl className="page-record-detail">
      {[['Program', detail.program?.name || detail.application.programName], ['Organization', detail.program?.org], ['Application status', detail.application.status], ['Applied on', detail.application.appliedAt], ['Applicant message', detail.application.message]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{display(value)}</dd></div>)}
    </dl></section>}
    <section aria-label="Volunteer profile"><h4>{detail.application ? 'Applicant profile' : 'Volunteer profile'}</h4><dl className="page-record-detail">{fields.map(([key,label]) => <div key={key}><dt>{label}</dt><dd>{display(detail.profile?.[key])}</dd></div>)}</dl></section>
  </>;
}
