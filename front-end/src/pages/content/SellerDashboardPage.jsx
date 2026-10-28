import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import { PageField, PageModal, PageRegion } from '../runtime/PageElements.jsx';

export default function SellerDashboardPage() {
  const ui = usePage();
  return <>
   <main className="seller-dashboard-page">
   <div {...ui.props("seller-dashboard-1", {"className": "main-content"})}>
     <div {...ui.props("seller-dashboard-2", {"className": "page-header"})}>
       <div {...ui.props("seller-dashboard-3", {"className": "page-header-text"})}>
         <h1 {...ui.props("sellerBusinessName", {"id": "sellerBusinessName"})}>
           {ui.content("sellerBusinessName", <>
           {"Artisan & Seller Dashboard"}
           </>)}
         </h1>
         <p {...ui.props("seller-dashboard-5", {})}>
           {"Manage your product catalog, add photos, set prices, and view approval status"}
         </p>
       </div>
       <button {...ui.props("seller-dashboard-6", {"className": "btn-add-org", "style": {"background": "#0d9488", "borderColor": "#0d9488"}, "type": "button", "actionLabel": "+ Add New Product"}, {"click": {"name": "openAddProductModal", "args": []}})}>
         {"+ Add New Product"}
       </button>
     </div>
     <div {...ui.props("seller-dashboard-7", {"className": "stat-cards"})}>
       <div {...ui.props("seller-dashboard-8", {"className": "stat-card"})}>
         <div {...ui.props("seller-dashboard-9", {"className": "stat-card-header"})}>
           <div {...ui.props("seller-dashboard-10", {"className": "stat-icon blue", "style": {"background": "#ccfbf1", "color": "#0d9488"}})}>
             {"🛍️"}
           </div>
         </div>
         <div {...ui.props("stat-seller-total", {"className": "stat-value", "id": "stat-seller-total"})}>
           {ui.content("stat-seller-total", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("seller-dashboard-12", {"className": "stat-label"})}>
           {"Total Products Listed"}
         </div>
         <div {...ui.props("seller-dashboard-13", {"className": "stat-change positive"})}>
           {"In your catalog"}
         </div>
       </div>
       <div {...ui.props("seller-dashboard-14", {"className": "stat-card"})}>
         <div {...ui.props("seller-dashboard-15", {"className": "stat-card-header"})}>
           <div {...ui.props("seller-dashboard-16", {"className": "stat-icon green"})}>
             {"✓"}
           </div>
         </div>
         <div {...ui.props("stat-seller-approved", {"className": "stat-value", "id": "stat-seller-approved"})}>
           {ui.content("stat-seller-approved", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("seller-dashboard-18", {"className": "stat-label"})}>
           {"Live on Public Shop"}
         </div>
         <div {...ui.props("seller-dashboard-19", {"className": "stat-change positive"})}>
           {"Approved by Admin"}
         </div>
       </div>
       <div {...ui.props("seller-dashboard-20", {"className": "stat-card"})}>
         <div {...ui.props("seller-dashboard-21", {"className": "stat-card-header"})}>
           <div {...ui.props("seller-dashboard-22", {"className": "stat-icon orange"})}>
             {"⏳"}
           </div>
         </div>
         <div {...ui.props("stat-seller-pending", {"className": "stat-value", "id": "stat-seller-pending"})}>
           {ui.content("stat-seller-pending", <>
           {"0"}
           </>)}
         </div>
         <div {...ui.props("seller-dashboard-24", {"className": "stat-label"})}>
           {"Pending Approval"}
         </div>
         <div {...ui.props("seller-dashboard-25", {"className": "stat-change warning"})}>
           {"Under Review"}
         </div>
       </div>
       <div {...ui.props("seller-dashboard-26", {"className": "stat-card"})}>
         <div {...ui.props("seller-dashboard-27", {"className": "stat-card-header"})}>
           <div {...ui.props("seller-dashboard-28", {"className": "stat-icon purple", "style": {"background": "#f3e8ff", "color": "#9333ea"}})}>
             {"💰"}
           </div>
         </div>
         <div {...ui.props("stat-seller-balance", {"className": "stat-value", "id": "stat-seller-balance"})}>
           {ui.content("stat-seller-balance", <>
           {"₹0"}
           </>)}
         </div>
         <div {...ui.props("seller-dashboard-30", {"className": "stat-label"})}>
           {"Total Sales Earnings"}
         </div>
         <div {...ui.props("seller-dashboard-31", {"className": "stat-change info"})}>
           {"Direct support to artisans"}
         </div>
       </div>
     </div>
     <div {...ui.props("seller-dashboard-32", {"className": "section-card seller-bank-card", "style": {"marginBottom": "24px", "padding": "20px", "background": "#fff", "borderRadius": "14px", "border": "1px solid #e2e8f0"}})}>
       <h2 {...ui.props("seller-dashboard-33", {"style": {"fontSize": "1.15rem", "color": "#1e293b", "marginBottom": "12px"}})}>
         {"Bank Details"}
       </h2>
       <p {...ui.props("seller-dashboard-34", {"style": {"fontSize": ".85rem", "color": "#64748b", "marginBottom": "16px"}})}>
         {"Provide your bank details to receive payments directly for your sales."}
       </p>
       <div {...ui.props("seller-dashboard-35", {"className": "seller-bank-grid", "style": {"display": "grid", "gridTemplateColumns": "1fr 1fr 1fr", "gap": "16px", "marginBottom": "16px"}})}>
         <div {...ui.props("seller-dashboard-36", {"className": "form-group"})}>
           <label {...ui.props("seller-dashboard-37", {})}>
             {"Account Number"}
           </label>
           <PageField as="input" field="bank-acc-num" spec={{"type": "text", "id": "bank-acc-num", "placeholder": "e.g. 1234567890"}} />
         </div>
         <div {...ui.props("seller-dashboard-39", {"className": "form-group"})}>
           <label {...ui.props("seller-dashboard-40", {})}>
             {"IFSC Code"}
           </label>
           <PageField as="input" field="bank-ifsc" spec={{"type": "text", "id": "bank-ifsc", "placeholder": "e.g. SBIN0001234"}} />
         </div>
         <div {...ui.props("seller-dashboard-42", {"className": "form-group"})}>
           <label {...ui.props("seller-dashboard-43", {})}>
             {"Bank Name"}
           </label>
           <PageField as="input" field="bank-name" spec={{"type": "text", "id": "bank-name", "placeholder": "e.g. State Bank of India"}} />
         </div>
       </div>
       <button {...ui.props("seller-dashboard-45", {"className": "btn-add-org", "style": {"background": "#0d9488", "borderColor": "#0d9488", "fontSize": ".82rem", "padding": "7px 14px"}, "type": "button", "actionLabel": "Save Bank Details"}, {"click": {"name": "saveBankDetails", "args": []}})}>
         {"Save Bank Details"}
       </button>
     </div>
     <div {...ui.props("seller-dashboard-46", {"className": "section-card"})}>
       <div {...ui.props("seller-dashboard-47", {"className": "section-card-header", "style": {"marginBottom": "20px"}})}>
         <h2 {...ui.props("seller-dashboard-48", {})}>
           {"My Products"}
         </h2>
         <button {...ui.props("seller-dashboard-49", {"className": "btn-add-org", "style": {"background": "#0d9488", "borderColor": "#0d9488", "fontSize": ".82rem", "padding": "7px 14px"}, "type": "button", "actionLabel": "+ Add Product"}, {"click": {"name": "openAddProductModal", "args": []}})}>
           {"+ Add Product"}
         </button>
       </div>
       <div {...ui.props("sellerProductsGrid", {"id": "sellerProductsGrid", "className": "products-seller-grid"})}>
         <PageRegion name="sellerProductsGrid" />
       </div>
     </div>
   </div>
   <PageModal name="addProductModal">
     <div {...ui.props("seller-dashboard-52", {"className": "modal-box"})}>
       <div {...ui.props("seller-dashboard-53", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "18px"}})}>
         <h2 {...ui.props("seller-dashboard-54", {"style": {"fontSize": "1.2rem", "fontWeight": "700", "color": "#1e293b", "margin": "0"}})}>
           {"Add Product to Shop"}
         </h2>
         <button {...ui.props("seller-dashboard-55", {"style": {"background": "none", "border": "none", "fontSize": "1.4rem", "cursor": "pointer", "color": "#94a3b8"}, "type": "button", "actionLabel": "×"}, {"click": {"name": "closeAddProductModal", "args": []}})}>
           {"×"}
         </button>
       </div>
       <div {...ui.props("seller-dashboard-56", {"className": "form-group"})}>
         <label {...ui.props("seller-dashboard-57", {})}>
           {"Product Title *"}
         </label>
         <PageField as="input" field="prod-title" spec={{"type": "text", "id": "prod-title", "placeholder": "e.g. Handcrafted Ceramic Vase, Organic Spices Box"}} />
       </div>
       <div {...ui.props("seller-dashboard-59", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "14px"}})}>
         <div {...ui.props("seller-dashboard-60", {"className": "form-group"})}>
           <label {...ui.props("seller-dashboard-61", {})}>
             {"Category *"}
           </label>
           <PageField as="select" field="prod-category" spec={{"id": "prod-category"}}>
             <option {...ui.props("seller-dashboard-63", {"value": "Handicrafts"})}>
               {"Handicrafts"}
             </option>
             <option {...ui.props("seller-dashboard-64", {"value": "Food & Organic"})}>
               {"Food & Organic"}
             </option>
             <option {...ui.props("seller-dashboard-65", {"value": "Textiles & Apparel"})}>
               {"Textiles & Apparel"}
             </option>
             <option {...ui.props("seller-dashboard-66", {"value": "Pottery & Clay"})}>
               {"Pottery & Clay"}
             </option>
             <option {...ui.props("seller-dashboard-67", {"value": "Home Décor"})}>
               {"Home Décor"}
             </option>
             <option {...ui.props("seller-dashboard-68", {"value": "Traditional Art"})}>
               {"Traditional Art"}
             </option>
           </PageField>
         </div>
         <div {...ui.props("seller-dashboard-69", {"className": "form-group"})}>
           <label {...ui.props("seller-dashboard-70", {})}>
             {"Price (₹ INR) *"}
           </label>
           <PageField as="input" field="prod-price" spec={{"type": "number", "id": "prod-price", "placeholder": "1200", "min": "1"}} />
         </div>
         <div {...ui.props("seller-dashboard-72", {"className": "form-group"})}>
           <label {...ui.props("seller-dashboard-73", {})}>
             {"Quantity *"}
           </label>
           <PageField as="input" field="prod-quantity" spec={{"type": "number", "id": "prod-quantity", "placeholder": "e.g. 10", "min": "1"}} />
         </div>
       </div>
       <div {...ui.props("seller-dashboard-75", {"className": "form-group"})}>
         <label {...ui.props("seller-dashboard-76", {})}>
           {"Description"}
         </label>
         <PageField as="textarea" field="prod-desc" spec={{"id": "prod-desc", "rows": "3", "placeholder": "Describe the materials, artisan technique, or origin…"}}>
         </PageField>
       </div>
       <div {...ui.props("seller-dashboard-78", {"className": "form-group"})}>
         <label {...ui.props("seller-dashboard-79", {})}>
           {"Product Photo (Drag & Drop or Browse)"}
         </label>
         <div {...ui.props("prodPhotoDropZone", {"id": "prodPhotoDropZone", "style": {"border": "2px dashed #cbd5e1", "borderRadius": "12px", "padding": "20px", "textAlign": "center", "background": "#f8fafc", "cursor": "pointer", "transition": "all .2s"}, "actionLabel": "📷\n            Click to upload photo or drag & drop\n            PNG, JPG up to 4MB"}, {"click": {"name": "chooseFile", "args": ["prodPhotoInput"]}})}>
           {ui.content("prodPhotoDropZone", <>
           <PageField as="input" field="prodPhotoInput" spec={{"type": "file", "id": "prodPhotoInput", "accept": "image/*", "style": {"display": "none"}}} />
           <div {...ui.props("prodPhotoPrompt", {"id": "prodPhotoPrompt"})}>
             {ui.content("prodPhotoPrompt", <>
             <div {...ui.props("seller-dashboard-83", {"style": {"fontSize": "1.8rem", "marginBottom": "4px"}})}>
               {"📷"}
             </div>
             <div {...ui.props("seller-dashboard-84", {"style": {"fontWeight": "600", "fontSize": ".85rem", "color": "#1e293b"}})}>
               {"Click to upload photo or drag & drop"}
             </div>
             <div {...ui.props("seller-dashboard-85", {"style": {"fontSize": ".74rem", "color": "#94a3b8", "marginTop": "2px"}})}>
               {"PNG, JPG up to 4MB"}
             </div>
             </>)}
           </div>
           <img {...ui.props("prodPhotoPreview", {"id": "prodPhotoPreview", "style": {"display": "none", "width": "100%", "maxHeight": "160px", "objectFit": "contain", "borderRadius": "8px"}})} />
           </>)}
         </div>
       </div>
       <div {...ui.props("seller-dashboard-87", {"style": {"display": "flex", "gap": "10px", "justifyContent": "flex-end", "marginTop": "20px"}})}>
        <button {...ui.props("seller-dashboard-88", {"className": "seller-modal-cancel", "type": "button", "actionLabel": "Cancel"}, {"click": {"name": "closeAddProductModal", "args": []}})}>
           {"Cancel"}
         </button>
         <button {...ui.props("seller-dashboard-89", {"className": "btn-add-org", "style": {"background": "#0d9488", "borderColor": "#0d9488"}, "type": "button", "actionLabel": "Submit for Approval →"}, {"click": {"name": "saveNewProduct", "args": []}})}>
           {"Submit for Approval →"}
         </button>
       </div>
     </div>
   </PageModal>
     <PageExtras />
   </main>
  </>;
}
