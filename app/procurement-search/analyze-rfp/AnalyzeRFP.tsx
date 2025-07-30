"use client";
import { useFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { API_ROUTES } from '@/app/constants/api';

interface FileUploadValues {
  existing_files: File[];
  new_file: File | null;
  temperature?: string;
}

const AnalyzeRFP = () => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialValues: FileUploadValues = {
    existing_files: [],
    new_file: null,
    temperature: '0.7', // Default to 0.7 as per request body example
  };

  const validationSchema = Yup.object({
    existing_files: Yup.array()
      .of(
        Yup.mixed<File>()
          .test('fileSize', 'File too large (max 5MB)', (value) =>
            value ? value.size <= 5 * 1024 * 1024 : true
          )
          .test('fileType', 'Only PDF files are supported', (value) =>
            value ? ['application/pdf'].includes(value.type) : true
          )
      )
      .min(1, 'At least one existing file is required')
      .required('Existing files are required'),
    new_file: Yup.mixed<File>()
      .required('New file is required')
      .test('fileSize', 'File too large (max 5MB)', (value) =>
        value ? value.size <= 5 * 1024 * 1024 : true
      )
      .test('fileType', 'Only PDF files are supported', (value) =>
        value ? ['application/pdf'].includes(value.type) : true
      ),
    temperature: Yup.string()
      .matches(/^-?\d*\.?\d+$/, 'Must be a number')
      .notRequired(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setErrorMessage(null); // Clear previous errors
      const formData = new FormData();

      // Append existing_files as multiple files under the same key
      values.existing_files.forEach((file) => {
        formData.append('existing_files', file);
      });

      // Append new_file
      if (values.new_file) {
        formData.append('new_file', values.new_file);
      }

      // Append temperature as a number or empty string
      if (values.temperature) {
        formData.append('temperature', parseFloat(values.temperature).toString());
      } else {
        formData.append('temperature', '');
      }

      try {
        const response = await fetch(API_ROUTES.analyzeRFP, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          throw new Error(`Failed to analyze files: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        setAnalysisResult(result.analysis);
        formik.resetForm(); // Reset form on success
      } catch (error: any) {
        console.error('Error submitting form:', error);
        setErrorMessage(error.message || 'An error occurred while uploading files.');
      }
    },
  });

  const handleExistingFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Prevent duplicate files
      const uniqueFiles = fileArray.filter(
        (newFile) => !formik.values.existing_files.some((existingFile) => existingFile.name === newFile.name)
      );
      formik.setFieldValue('existing_files', [...formik.values.existing_files, ...uniqueFiles]);
    }
  };

  const handleNewFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('new_file', event.target.files?.[0] || null);
  };

  const removeExistingFile = (index: number) => {
    const updatedFiles = formik.values.existing_files.filter((_, i) => i !== index);
    formik.setFieldValue('existing_files', updatedFiles);
  };

  const renderExistingFilesErrors = (errors: unknown): React.ReactNode => {
    if (typeof errors === 'string') {
      return <div>{errors}</div>;
    }
    if (Array.isArray(errors)) {
      return errors.map((error, index) => {
        if (typeof error === 'string') {
          return <div key={index}>{error}</div>;
        }
        if (error && typeof error === 'object') {
          return (
            <div key={index}>
              {Object.values(error).map((err, i) => (
                <div key={i}>{String(err)}</div>
              ))}
            </div>
          );
        }
        return null;
      });
    }
    if (errors && typeof errors === 'object') {
      return Object.values(errors).map((err, i) => (
        <div key={i}>{String(err)}</div>
      ));
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <h2 className="text-xl font-bold mb-6 mt-8 ">File Upload</h2>
      <div className='p-12 bg-white rounded-lg shadow-md'>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Existing Files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Files *
            </label>
            <input
              type="file"
              multiple
              name="existing_files"
              onChange={handleExistingFilesChange}
              onBlur={formik.handleBlur}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".pdf"
            />
            {formik.values.existing_files.length > 0 && (
              <div className="mt-2">
                {formik.values.existing_files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExistingFile(index)}
                      className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formik.touched.existing_files && formik.errors.existing_files && (
              <div className="text-red-500 text-sm mt-1">
                {renderExistingFilesErrors(formik.errors.existing_files)}
              </div>
            )}
          </div>

          {/* New File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New File Upload *
            </label>
            <input
              type="file"
              name="new_file"
              onChange={handleNewFileChange}
              onBlur={formik.handleBlur}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".pdf"
            />
            {formik.touched.new_file && formik.errors.new_file && (
              <div className="text-red-500 text-sm mt-1">{String(formik.errors.new_file)}</div>
            )}
            {formik.values.new_file && (
              <div className="text-sm text-gray-600 mt-1">
                Selected: {formik.values.new_file.name} ({(formik.values.new_file.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Temperature Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (optional)
            </label>
            <input
              type="text"
              name="temperature"
              value={formik.values.temperature || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded py-2 px-3"
              placeholder="Enter temperature (e.g., 0.7)"
            />
            {formik.touched.temperature && formik.errors.temperature && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.temperature}</div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Uploading...' : 'Upload Files'}
          </button>
        </form>
        {/* Analysis Result */}
        {analysisResult && (
          <div className="mt-8 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Analysis Result</h3>
            <div className="prose max-w-none">
              <ReactMarkdown>{analysisResult}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeRFP;