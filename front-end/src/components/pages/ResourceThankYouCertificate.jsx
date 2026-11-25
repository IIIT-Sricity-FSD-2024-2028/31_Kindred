import { usePage } from '../../pages/runtime/PageContext.js';
import Modal from '../ui/Modal.jsx';
export default function ResourceThankYouCertificate() {
  const ui=usePage(),query=new URLSearchParams(ui.location.search).get('resourceCertificate');
  const id=ui.state.resourceCertificateId || (ui.state.closedResourceCertificateLocation===ui.location.key?null:query);
  const donation=ui.data('resources').find(resource=>resource.id===id),certificate=donation?.certificate;
  return <Modal open={Boolean(id)} title="Resource donation thank-you certificate" className="resource-certificate-dialog" onClose={()=>ui.update({resourceCertificateId:null,closedResourceCertificateLocation:ui.location.key})}>
    {!certificate&&<p role="status">{ui.collections.resources?.loading?'Loading your certificate…':'This certificate is available after the organization confirms receipt.'}</p>}
    {certificate&&<><div className="completion-certificate resource-thankyou-certificate"><p className="certificate-logo">{certificate.organization}</p><h2>CERTIFICATE OF APPRECIATION</h2><p>With thanks to</p><h1>{certificate.donorName}</h1><p>For your resource donation received by <strong>{certificate.organization}</strong>{certificate.programName&&<> for <strong>{certificate.programName}</strong></>}.</p><table><thead><tr><th>Resource</th><th>Quantity received</th><th>Condition</th></tr></thead><tbody>{certificate.items.map((item,index)=><tr key={index}><td>{item.name}</td><td>{item.quantity} {item.unit}</td><td>{item.condition}</td></tr>)}</tbody></table><p>Confirmed usable quantities received by the organization.</p><p>Issued: {new Date(certificate.issuedAt).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'})}</p><small>{certificate.id}<br/>Donation: {certificate.donationId}</small><p>Issued by the Organization Administrator</p></div><button type="button" className="btn-modal-save" onClick={()=>window.print()}>Print / Save PDF</button></>}
  </Modal>;
}
