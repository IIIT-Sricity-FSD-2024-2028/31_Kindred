import { usePage } from '../../pages/runtime/PageContext.js';

export default function FormError() {
  const { state } = usePage();
  return state.error ? <p id="page-form-error" role="alert" className="inline-form-error">{state.error}</p> : null;
}
