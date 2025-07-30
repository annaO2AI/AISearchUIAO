// components/ContractAgreementForm.tsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { apiRequest } from '@/app/utils/axios';

interface ContractAgreementValues {
  doc_type: string;
  company_name: string;
  client_name: string;
  services: string;
  start_date: string;
  end_date: string;
  termination: string;
  confidentiality: string;
  signer_1: string;
  title_1: string;
  signer_2: string;
  title_2: string;
  temperature?: string;
}

const ContractAgreementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: ContractAgreementValues = {
    doc_type: '',
    company_name: '',
    client_name: '',
    services: '',
    start_date: '',
    end_date: '',
    termination: '',
    confidentiality: '',
    signer_1: '',
    title_1: '',
    signer_2: '',
    title_2: '',
    temperature: '',
  };

  const validationSchema = Yup.object({
    doc_type: Yup.string().required('Document type is required'),
    company_name: Yup.string().required('Company name is required'),
    client_name: Yup.string().required('Client name is required'),
    services: Yup.string().required('Services description is required'),
    start_date: Yup.date().required('Start date is required'),
    end_date: Yup.date()
      .required('End date is required')
      .min(Yup.ref('start_date'), 'End date must be after start date'),
    termination: Yup.string().required('Termination terms are required'),
    confidentiality: Yup.string().required('Confidentiality terms are required'),
    signer_1: Yup.string().required('First signer name is required'),
    title_1: Yup.string().required('First signer title is required'),
    signer_2: Yup.string().required('Second signer name is required'),
    title_2: Yup.string().required('Second signer title is required'),
    temperature: Yup.string()
      .matches(/^-?\d*\.?\d+$/, 'Must be a valid number')
      .notRequired(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Format dates for display
        const formattedValues = {
          ...values,
          start_date: new Date(values.start_date).toLocaleDateString(),
          end_date: new Date(values.end_date).toLocaleDateString(),
        };

        console.log('Form submission:', formattedValues);
          const res = await apiRequest('POST',"/generate_baa_sow", formattedValues);
        // Simulate API call
        formik.resetForm();
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit contract');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className='max-w-4xl mx-auto pt-12 mb-16'>
      <h1 className="text-2xl font-bold mb-6 pt-6 mt-6">Contract Agreement Form</h1>
      <div className=" p-12 bg-white rounded-lg shadow-md mt-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Document Type and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="doc_type" className="block text-sm font-medium text-gray-700 mb-1">
                Document Type *
              </label>
              <select
                id="doc_type"
                name="doc_type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.doc_type}
                className="w-full rounded border border-gray-300 p-2"
              >
                <option value="">Select document type</option>
                <option value="service_agreement">Service Agreement</option>
                <option value="nda">Non-Disclosure Agreement</option>
                <option value="contract">General Contract</option>
                <option value="sow">Statement of Work</option>
              </select>
              {formik.touched.doc_type && formik.errors.doc_type && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.doc_type}</div>
              )}
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (Optional)
              </label>
              <input
                id="temperature"
                name="temperature"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.temperature}
                placeholder="e.g., 36.5"
                className="w-full rounded border border-gray-300 p-2"
              />
              {formik.touched.temperature && formik.errors.temperature && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.temperature}</div>
              )}
            </div>
          </div>

          {/* Parties Information */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-4">Parties Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.company_name}
                  className="w-full rounded border border-gray-300 p-2"
                />
                {formik.touched.company_name && formik.errors.company_name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.company_name}</div>
                )}
              </div>

              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  id="client_name"
                  name="client_name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.client_name}
                  className="w-full rounded border border-gray-300 p-2"
                />
                {formik.touched.client_name && formik.errors.client_name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.client_name}</div>
                )}
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-4">Contract Terms</h2>
            
            <div className="mb-4">
              <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
                Services Description *
              </label>
              <textarea
                id="services"
                name="services"
                rows={4}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.services}
                className="w-full rounded border border-gray-300 p-2"
              />
              {formik.touched.services && formik.errors.services && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.services}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.start_date}
                  className="w-full rounded border border-gray-300 p-2"
                />
                {formik.touched.start_date && formik.errors.start_date && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.start_date}</div>
                )}
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.end_date}
                  className="w-full rounded border border-gray-300 p-2"
                />
                {formik.touched.end_date && formik.errors.end_date && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.end_date}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="termination" className="block text-sm font-medium text-gray-700 mb-1">
                Termination Terms *
              </label>
              <textarea
                id="termination"
                name="termination"
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.termination}
                className="w-full rounded border border-gray-300 p-2"
              />
              {formik.touched.termination && formik.errors.termination && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.termination}</div>
              )}
            </div>

            <div>
              <label htmlFor="confidentiality" className="block text-sm font-medium text-gray-700 mb-1">
                Confidentiality Terms *
              </label>
              <textarea
                id="confidentiality"
                name="confidentiality"
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confidentiality}
                className="w-full rounded border border-gray-300 p-2"
              />
              {formik.touched.confidentiality && formik.errors.confidentiality && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confidentiality}</div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded">
                <h3 className="font-medium mb-3">Company Representative</h3>
                <div className="mb-3">
                  <label htmlFor="signer_1" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    id="signer_1"
                    name="signer_1"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.signer_1}
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  {formik.touched.signer_1 && formik.errors.signer_1 && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.signer_1}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="title_1" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    id="title_1"
                    name="title_1"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title_1}
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  {formik.touched.title_1 && formik.errors.title_1 && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.title_1}</div>
                  )}
                </div>
              </div>

              <div className="border p-4 rounded">
                <h3 className="font-medium mb-3">Client Representative</h3>
                <div className="mb-3">
                  <label htmlFor="signer_2" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    id="signer_2"
                    name="signer_2"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.signer_2}
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  {formik.touched.signer_2 && formik.errors.signer_2 && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.signer_2}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="title_2" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    id="title_2"
                    name="title_2"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title_2}
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  {formik.touched.title_2 && formik.errors.title_2 && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.title_2}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Generate Contract Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractAgreementForm; 