import { Link } from '../../routes/navigation.jsx';
import { usePage } from '../runtime/PageContext.js';
import PageExtras from '../../components/pages/PageExtras.jsx';
import AnimatedPaymentCard from '../../components/pages/AnimatedPaymentCard.jsx';
import { PageField, PageModal, PageRegion } from '../runtime/PageElements.jsx';

export default function ShopPage() {
  const ui = usePage();
  return <>
   <main data-react-page="/shop.html">
   <div {...ui.props("shop-1", {"className": "main-content"})}>
     <div {...ui.props("shop-2", {"className": "shop-hero"})}>
       <h1 {...ui.props("shop-3", {})}>
         {"Kindred Artisan & Community Shop"}
       </h1>
       <p {...ui.props("shop-4", {})}>
         {"Discover authentic handicrafts, textiles, and organic goods handcrafted by local sellers and NGOs. Every purchase directly empowers artisan families across India."}
       </p>
       <div {...ui.props("shop-5", {"style": {"display": "flex", "gap": "12px", "justifyContent": "center", "flexWrap": "wrap"}})}>
         <Link {...ui.props("shop-6", {"style": {"padding": "10px 22px", "background": "#fff", "color": "#0f766e", "borderRadius": "10px", "fontWeight": "700", "textDecoration": "none", "fontSize": ".9rem"}, "actionLabel": "Join as a Seller →", "to": "/signup.html"})}>
           {"Join as a Seller →"}
         </Link>
         {" "}
         <a {...ui.props("shop-7", {"href": "#shop-catalog", "style": {"padding": "10px 22px", "background": "rgba(255,255,255,.15)", "color": "#fff", "border": "1px solid rgba(255,255,255,.4)", "borderRadius": "10px", "fontWeight": "600", "textDecoration": "none", "fontSize": ".9rem"}, "actionLabel": "Browse Products ↓"})}>
           {"Browse Products ↓"}
         </a>
       </div>
     </div>
     <div {...ui.props("shop-catalog", {"id": "shop-catalog", "style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "flexWrap": "wrap", "gap": "16px", "marginBottom": "20px"}})}>
       {ui.content("shop-catalog", <>
       <div {...ui.props("shop-9", {"className": "category-chips"})}>
         <button {...ui.props("shop-10", {"className": "category-chip active", "data-cat": "all", "type": "button", "actionLabel": "All Products"}, {"click": {"name": "filterShopCategory", "args": ["all"]}})}>
           {"All Products"}
         </button>
         <button {...ui.props("shop-11", {"className": "category-chip", "data-cat": "Handicrafts", "type": "button", "actionLabel": "Handicrafts"}, {"click": {"name": "filterShopCategory", "args": ["Handicrafts"]}})}>
           {"Handicrafts"}
         </button>
         <button {...ui.props("shop-12", {"className": "category-chip", "data-cat": "Food & Organic", "type": "button", "actionLabel": "Food & Organic"}, {"click": {"name": "filterShopCategory", "args": ["Food & Organic"]}})}>
           {"Food & Organic"}
         </button>
         <button {...ui.props("shop-13", {"className": "category-chip", "data-cat": "Textiles & Apparel", "type": "button", "actionLabel": "Textiles & Apparel"}, {"click": {"name": "filterShopCategory", "args": ["Textiles & Apparel"]}})}>
           {"Textiles & Apparel"}
         </button>
         <button {...ui.props("shop-14", {"className": "category-chip", "data-cat": "Pottery & Clay", "type": "button", "actionLabel": "Pottery & Clay"}, {"click": {"name": "filterShopCategory", "args": ["Pottery & Clay"]}})}>
           {"Pottery & Clay"}
         </button>
       </div>
       <div {...ui.props("shop-15", {"className": "search-bar", "style": {"maxWidth": "300px"}})}>
         <span {...ui.props("shop-16", {"className": "search-icon"})}>
           {"🔍"}
         </span>
         <PageField as="input" field="shop-17" spec={{"type": "text", "placeholder": "Search products..."}} />
       </div>
       </>)}
     </div>
     <div {...ui.props("shop-18", {"style": {"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "20px"}})}>
       <div {...ui.props("shopProductCount", {"id": "shopProductCount", "style": {"fontSize": ".85rem", "color": "#64748b", "fontWeight": "600"}})}>
         {ui.content("shopProductCount", <>
         {"Loading products…"}
         </>)}
       </div>
       <div {...ui.props("shop-20", {"style": {"fontSize": ".8rem", "color": "#0d9488", "fontWeight": "600"}})}>
         {"✓ Admin Verified Products Only"}
       </div>
     </div>
     <div {...ui.props("shopProductsGrid", {"id": "shopProductsGrid", "className": "shop-products-grid"})}>
       <PageRegion name="shopProductsGrid" />
     </div>
   </div>
   <PageModal name="shopDetailModal">
     <div {...ui.props("shop-23", {"className": "modal-box"})}>
       <button {...ui.props("shop-24", {"style": {"position": "absolute", "top": "16px", "right": "18px", "background": "none", "border": "none", "fontSize": "1.5rem", "cursor": "pointer", "color": "#94a3b8"}, "type": "button", "actionLabel": "×"}, {"click": {"name": "closeShopDetailModal", "args": []}})}>
         {"×"}
       </button>
       <div {...ui.props("shopDetailContent", {"id": "shopDetailContent"})}>
         <PageRegion name="shopDetailContent" />
       </div>
     </div>
   </PageModal>
   <PageModal name="checkoutModal">
     <div {...ui.props("shop-27", {"className": "modal-box donation-box", "style": {"maxWidth": "520px"}})}>
       <button {...ui.props("shop-28", {"className": "modal-close", "style": {"position": "absolute", "top": "16px", "right": "18px", "background": "none", "border": "none", "fontSize": "1.4rem", "cursor": "pointer", "color": "#94a3b8"}, "type": "button", "actionLabel": "✕"}, {"click": {"name": "closeCheckoutModal", "args": []}})}>
         {"✕"}
       </button>
       <div {...ui.props("shop-step-1", {"id": "shop-step-1"})}>
         {ui.content("shop-step-1", <>
         <h2 {...ui.props("shop-30", {"style": {"fontSize": "1.35rem", "fontWeight": "800", "color": "#1e293b", "margin": "0 0 4px"}})}>
           {"Complete Your Order"}
         </h2>
         <p {...ui.props("shop-31", {"style": {"fontSize": ".82rem", "color": "#64748b", "margin": "0 0 16px"}})}>
           {"100% of proceeds go directly to support local artisans and rural livelihoods."}
         </p>
         <div {...ui.props("checkout-product-details", {"id": "checkout-product-details", "style": {"marginBottom": "16px", "padding": "12px 14px", "background": "#f8fafc", "borderRadius": "10px", "border": "1px solid #e2e8f0"}})}>
           <PageRegion name="checkout-product-details" />
         </div>
         <div {...ui.props("shop-33", {"className": "checkout-fields-row", "style": {"display": "grid", "gridTemplateColumns": "minmax(0, 1fr) minmax(0, 1fr)", "gap": "12px", "marginBottom": "12px"}})}>
           <div {...ui.props("shop-34", {"className": "form-group", "style": {"margin": "0"}})}>
             <label {...ui.props("shop-35", {"style": {"fontSize": ".8rem", "fontWeight": "600", "color": "#475569", "marginBottom": "4px", "display": "block"}})}>
               {"Quantity"}
             </label>
             <PageField as="input" field="checkout-qty" spec={{"type": "number", "id": "checkout-qty", "min": "1", "style": {"width": "100%", "padding": "9px 12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontFamily": "inherit", "fontSize": ".9rem", "outline": "none"}}} />
           </div>
           <div {...ui.props("shop-37", {"className": "form-group", "style": {"margin": "0"}})}>
             <label {...ui.props("shop-38", {"style": {"fontSize": ".8rem", "fontWeight": "600", "color": "#475569", "marginBottom": "4px", "display": "block"}})}>
               {"Contact Phone *"}
             </label>
             <PageField as="input" field="checkout-phone" spec={{"type": "text", "id": "checkout-phone", "placeholder": "+91 98765 43210", "style": {"width": "100%", "padding": "9px 12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontFamily": "inherit", "fontSize": ".9rem", "outline": "none"}}} />
           </div>
         </div>
         <div {...ui.props("shop-40", {"className": "form-group", "style": {"marginBottom": "12px"}})}>
           <label {...ui.props("shop-41", {"style": {"fontSize": ".8rem", "fontWeight": "600", "color": "#475569", "marginBottom": "4px", "display": "block"}})}>
             {"Your Full Name *"}
           </label>
           <PageField as="input" field="checkout-name" spec={{"type": "text", "id": "checkout-name", "placeholder": "e.g. Priya Sharma", "style": {"width": "100%", "padding": "9px 12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontFamily": "inherit", "fontSize": ".9rem", "outline": "none"}}} />
         </div>
         <div {...ui.props("shop-43", {"className": "form-group", "style": {"marginBottom": "12px"}})}>
           <label {...ui.props("shop-44", {"style": {"fontSize": ".8rem", "fontWeight": "600", "color": "#475569", "marginBottom": "4px", "display": "block"}})}>
             {"Email Address *"}
           </label>
           <PageField as="input" field="checkout-email" spec={{"type": "email", "id": "checkout-email", "placeholder": "priya@example.com", "style": {"width": "100%", "padding": "9px 12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontFamily": "inherit", "fontSize": ".9rem", "outline": "none"}}} />
         </div>
         <div {...ui.props("shop-46", {"className": "form-group", "style": {"marginBottom": "16px"}})}>
           <label {...ui.props("shop-47", {"style": {"fontSize": ".8rem", "fontWeight": "600", "color": "#475569", "marginBottom": "4px", "display": "block"}})}>
             {"Delivery Address *"}
           </label>
           <PageField as="textarea" field="checkout-address" spec={{"id": "checkout-address", "rows": "2", "placeholder": "Full delivery address with pincode...", "style": {"width": "100%", "padding": "9px 12px", "border": "1.5px solid #e2e8f0", "borderRadius": "8px", "fontFamily": "inherit", "fontSize": ".88rem", "outline": "none", "resize": "vertical"}}}>
           </PageField>
         </div>
         <PageField as="input" field="checkout-prod-id" spec={{"type": "hidden", "id": "checkout-prod-id"}} />
         <button {...ui.props("proceed-shop-pay-btn", {"className": "btn-pay-now", "id": "proceed-shop-pay-btn", "style": {"background": "linear-gradient(135deg,#0d9488,#0f766e)"}, "type": "button", "actionLabel": "💳 Proceed to Payment (₹0)"}, {"click": {"name": "proceedToShopPayment", "args": []}})}>
           {ui.content("proceed-shop-pay-btn", <>
           {" 💳 Proceed to Payment ("}
           <span {...ui.props("checkout-total-btn", {"id": "checkout-total-btn"})}>
             {ui.content("checkout-total-btn", <>
             {"₹0"}
             </>)}
           </span>
           {") "}
           </>)}
         </button>
         <p {...ui.props("shop-52", {"style": {"textAlign": "center", "fontSize": ".75rem", "color": "#94a3b8", "marginTop": "10px"}})}>
           {"🔒 100% Secure & Encrypted Payment • Free Volunteer Delivery"}
         </p>
         </>)}
       </div>
       <div {...ui.props("shop-step-2", {"id": "shop-step-2", "style": {"display": "none"}})}>
         {ui.content("shop-step-2", <>
         <p className="page-payment-note">Payment demonstration: no card is charged.</p>
         <div {...ui.props("shop-54", {"style": {"display": "flex", "alignItems": "center", "gap": "10px", "marginBottom": "16px"}})}>
           <button {...ui.props("shop-55", {"style": {"background": "none", "border": "none", "cursor": "pointer", "fontSize": "1.1rem", "color": "#0d9488", "fontWeight": "700"}, "type": "button", "actionLabel": "← Back"}, {"click": {"name": "backToShopStep1", "args": []}})}>
             {"← Back"}
           </button>
           <h2 {...ui.props("shop-56", {"style": {"fontSize": "1.25rem", "fontWeight": "800", "color": "#1e293b", "margin": "0"}})}>
             {"Card Payment"}
           </h2>
         </div>
         <AnimatedPaymentCard prefix="shop-" />
         <div {...ui.props("shop-76", {"className": "card-form"})}>
           <div {...ui.props("shop-77", {"className": "card-field-group"})}>
             <label {...ui.props("shop-78", {"className": "card-field-label"})}>
               {"Card Number "}
               <span {...ui.props("shop-79", {"style": {"color": "#ef4444"}})}>
                 {"*"}
               </span>
             </label>
             <div {...ui.props("shop-card-num-wrap", {"className": "card-field-wrap", "id": "shop-card-num-wrap"})}>
               {ui.content("shop-card-num-wrap", <>
               <PageField as="input" field="shop-card-number" spec={{"type": "text", "id": "shop-card-number", "className": "card-field-input", "placeholder": "1234 5678 9012 3456", "maxLength": "19", "autoComplete": "cc-number", "inputMode": "numeric"}} />
               <span {...ui.props("shop-card-type-icon", {"className": "card-field-icon", "id": "shop-card-type-icon"})}>
                 {ui.content("shop-card-type-icon", <>
                 {"💳"}
                 </>)}
               </span>
               </>)}
             </div>
             <div {...ui.props("shop-card-prefix-indicator", {"id": "shop-card-prefix-indicator", "style": {"fontSize": ".78rem", "marginTop": "2px", "minHeight": "18px", "fontWeight": "600"}})}>
               {ui.content("shop-card-prefix-indicator", <>
               </>)}
             </div>
             <div {...ui.props("shop-84", {"style": {"fontSize": ".72rem", "color": "#94a3b8"}})}>
               {"Accepts Visa (starts with 4) and Mastercard (starts with 51 or 52)"}
             </div>
           </div>
           <div {...ui.props("shop-85", {"className": "card-field-group"})}>
             <label {...ui.props("shop-86", {"className": "card-field-label"})}>
               {"Cardholder Name "}
               <span {...ui.props("shop-87", {"style": {"color": "#ef4444"}})}>
                 {"*"}
               </span>
             </label>
             <div {...ui.props("shop-card-name-wrap", {"className": "card-field-wrap", "id": "shop-card-name-wrap"})}>
               {ui.content("shop-card-name-wrap", <>
               <PageField as="input" field="shop-card-holder-name" spec={{"type": "text", "id": "shop-card-holder-name", "className": "card-field-input", "placeholder": "As printed on card", "autoComplete": "cc-name"}} />
               </>)}
             </div>
           </div>
           <div {...ui.props("shop-90", {"style": {"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "14px"}})}>
             <div {...ui.props("shop-91", {"className": "card-field-group"})}>
               <label {...ui.props("shop-92", {"className": "card-field-label"})}>
                 {"Expiry Date "}
                 <span {...ui.props("shop-93", {"style": {"color": "#ef4444"}})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("shop-card-exp-wrap", {"className": "card-field-wrap", "id": "shop-card-exp-wrap"})}>
                 {ui.content("shop-card-exp-wrap", <>
                 <PageField as="input" field="shop-card-expiry" spec={{"type": "text", "id": "shop-card-expiry", "className": "card-field-input", "placeholder": "MM/YY", "maxLength": "5", "autoComplete": "cc-exp", "inputMode": "numeric"}} />
                 </>)}
               </div>
             </div>
             <div {...ui.props("shop-96", {"className": "card-field-group"})}>
               <label {...ui.props("shop-97", {"className": "card-field-label"})}>
                 {"CVV "}
                 <span {...ui.props("shop-98", {"style": {"color": "#ef4444"}})}>
                   {"*"}
                 </span>
               </label>
               <div {...ui.props("shop-card-cvv-wrap", {"className": "card-field-wrap", "id": "shop-card-cvv-wrap"})}>
                 {ui.content("shop-card-cvv-wrap", <>
                 <PageField as="input" field="shop-card-cvv" spec={{"type": "password", "id": "shop-card-cvv", "className": "card-field-input", "placeholder": "•••", "maxLength": "4", "autoComplete": "cc-csc", "inputMode": "numeric"}} />
                 <span {...ui.props("shop-101", {"className": "card-field-icon"})}>
                   {"🔒"}
                 </span>
                 </>)}
               </div>
             </div>
           </div>
           <button {...ui.props("shop-pay-now-btn", {"className": "btn-pay-now", "id": "shop-pay-now-btn", "style": {"background": "linear-gradient(135deg,#0d9488,#0f766e)"}, "type": "button", "actionLabel": "🔒 Pay & Place Order (₹0)"}, {"click": {"name": "executeShopPayment", "args": []}})}>
             {ui.content("shop-pay-now-btn", <>
             {" 🔒 Pay & Place Order ("}
             <span {...ui.props("shop-pay-amount-display", {"id": "shop-pay-amount-display"})}>
               {ui.content("shop-pay-amount-display", <>
               {"₹0"}
               </>)}
             </span>
             {") "}
             </>)}
           </button>
           <p {...ui.props("shop-104", {"style": {"textAlign": "center", "fontSize": ".78rem", "color": "#94a3b8", "marginTop": "8px"}})}>
             {"🏦 256-bit SSL encrypted · PCI DSS Compliant"}
           </p>
         </div>
         </>)}
       </div>
       <div {...ui.props("shop-step-loading", {"id": "shop-step-loading", "style": {"display": "none", "textAlign": "center", "padding": "40px 20px"}})}>
         {ui.content("shop-step-loading", <>
         <div {...ui.props("shop-106", {"className": "spinner", "style": {"width": "48px", "height": "48px", "border": "4px solid #e2e8f0", "borderTopColor": "#0d9488", "borderRadius": "50%", "animation": "spin 1s linear infinite", "margin": "0 auto 16px"}})}>
         </div>
         <h3 {...ui.props("shop-107", {"style": {"fontSize": "1.15rem", "fontWeight": "700", "color": "#1e293b", "margin": "0 0 6px"}})}>
           {"Processing Payment Securely..."}
         </h3>
         <p {...ui.props("shop-108", {"style": {"fontSize": ".82rem", "color": "#64748b", "margin": "0"}})}>
           {"Allocating artisan order and generating delivery task."}
         </p>
         </>)}
       </div>
       <div {...ui.props("shop-step-success", {"id": "shop-step-success", "style": {"display": "none", "textAlign": "center", "padding": "10px 0"}})}>
         {ui.content("shop-step-success", <>
         <div {...ui.props("shop-110", {"style": {"width": "56px", "height": "56px", "borderRadius": "50%", "background": "linear-gradient(135deg,#10b981,#059669)", "color": "#fff", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "1.8rem", "margin": "0 auto 14px", "boxShadow": "0 8px 24px rgba(16,185,129,.35)"}})}>
           {"✓"}
         </div>
         <h2 {...ui.props("shop-111", {"style": {"fontSize": "1.4rem", "fontWeight": "800", "color": "#1e293b", "margin": "0 0 6px"}})}>
           {"Order Confirmed!"}
         </h2>
         <p {...ui.props("shop-112", {"style": {"fontSize": ".88rem", "color": "#64748b", "margin": "0 0 16px"}})}>
           {"Thank you for supporting community artisans."}
         </p>
         <div {...ui.props("shop-113", {"style": {"background": "#f0fdf4", "border": "1px solid #bbf7d0", "borderRadius": "12px", "padding": "16px", "marginBottom": "18px", "textAlign": "left", "fontSize": ".85rem"}})}>
           <div {...ui.props("shop-114", {"style": {"fontWeight": "700", "color": "#15803d", "marginBottom": "8px"}})}>
             {"📦 Order & Delivery Summary"}
           </div>
           <div {...ui.props("shop-115", {"style": {"color": "#166534", "marginBottom": "4px"}})}>
             {"Item: "}
             <strong {...ui.props("success-prod-title", {"id": "success-prod-title"})}>
               {ui.content("success-prod-title", <>
               </>)}
             </strong>
           </div>
           <div {...ui.props("shop-117", {"style": {"color": "#166534", "marginBottom": "4px"}})}>
             {"Amount Paid: "}
             <strong {...ui.props("success-order-amount", {"id": "success-order-amount"})}>
               {ui.content("success-order-amount", <>
               </>)}
             </strong>
           </div>
           <div {...ui.props("shop-119", {"style": {"color": "#166534", "marginBottom": "4px"}})}>
             {"Order ID: "}
             <strong {...ui.props("success-order-id", {"id": "success-order-id"})}>
               {ui.content("success-order-id", <>
               </>)}
             </strong>
           </div>
           <div {...ui.props("shop-121", {"style": {"color": "#166534", "marginBottom": "4px"}})}>
             {"Payment Method: "}
             <strong {...ui.props("success-card-mask", {"id": "success-card-mask"})}>
               {ui.content("success-card-mask", <>
               </>)}
             </strong>
           </div>
           <div {...ui.props("shop-123", {"style": {"color": "#166534"}})}>
             {"Delivery Address: "}
             <strong {...ui.props("success-delivery-addr", {"id": "success-delivery-addr"})}>
               {ui.content("success-delivery-addr", <>
               </>)}
             </strong>
           </div>
         </div>
         <div {...ui.props("shop-125", {"style": {"background": "#eff6ff", "border": "1px solid #bfdbfe", "borderRadius": "10px", "padding": "12px", "fontSize": ".82rem", "color": "#1e40af", "marginBottom": "18px"}})}>
           {" 🚗 A volunteer has been assigned to pick up and deliver this order to your doorstep. "}
         </div>
         <button {...ui.props("shop-126", {"className": "btn-buy", "style": {"width": "100%", "padding": "12px"}, "type": "button", "actionLabel": "Continue Shopping →"}, {"click": {"name": "closeCheckoutModal", "args": []}})}>
           {"Continue Shopping →"}
         </button>
         </>)}
       </div>
     </div>
   </PageModal>
     <PageExtras />
   </main>
  </>;
}
