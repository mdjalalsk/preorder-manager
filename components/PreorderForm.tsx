'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PreorderFormProps {
  preorderId?: string;
}

export default function PreorderForm({ preorderId }: PreorderFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    products: '1',
    preorderWhen: 'regardless-of-stock',
    startsAt: '',
    endsAt: '',
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!preorderId);

  useEffect(() => {
    if (preorderId) {
      fetchPreorder();
    }
  }, [preorderId]);

  const fetchPreorder = async () => {
    try {
      const response = await fetch(`/api/preorders/${preorderId}`);
      if (!response.ok) throw new Error('Failed to fetch preorder');
      const preorder = await response.json();

      setFormData({
        name: preorder.name,
        products: preorder.products.toString(),
        preorderWhen: preorder.preorderWhen,
        startsAt: formatDateTimeForInput(preorder.startsAt),
        endsAt: preorder.endsAt ? formatDateTimeForInput(preorder.endsAt) : '',
        status: preorder.status,
      });
    } catch (error) {
      console.error('Error fetching preorder:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = preorderId ? `/api/preorders/${preorderId}` : '/api/preorders';
      const method = preorderId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save preorder');

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving preorder:', error);
      alert('Error saving preorder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-gray-700 hover:text-gray-900 text-lg"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Save changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-6">Preorder details</h2>
        <p className="text-gray-600 text-sm mb-8">These values appear in the preorders list.</p>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <p className="text-gray-600 text-sm mb-3">A label to recognize this preorder by.</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Products */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">Products</label>
            <p className="text-gray-600 text-sm mb-3">
              Number of products covered by this preorder.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="products"
                value={formData.products}
                onChange={handleChange}
                min="1"
                className="w-24 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">product(s)</span>
            </div>
          </div>

          {/* Preorder when */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">Preorder when</label>
            <p className="text-gray-600 text-sm mb-3">
              When customers are allowed to preorder.
            </p>
            <select
              name="preorderWhen"
              value={formData.preorderWhen}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="out-of-stock">out-of-stock</option>
              <option value="regardless-of-stock">regardless-of-stock</option>
            </select>
          </div>

          {/* Starts at */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">Starts at</label>
            <p className="text-gray-600 text-sm mb-3">When the preorder window opens.</p>
            <input
              type="datetime-local"
              name="startsAt"
              value={formData.startsAt}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ends at */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">Ends at</label>
            <p className="text-gray-600 text-sm mb-3">Leave empty for no end date.</p>
            <input
              type="datetime-local"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mm/dd/yyyy, --:-- --"
            />
          </div>

          {/* Status */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="status"
                id="status"
                checked={formData.status}
                onChange={handleChange}
                className="w-5 h-5 rounded"
              />
              <div>
                <label htmlFor="status" className="font-semibold text-gray-900">
                  Active
                </label>
                <p className="text-gray-600 text-sm">
                  Active preorders are visible to customers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
