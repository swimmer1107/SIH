import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useLanguage } from '../LanguageProvider';

// Mock Data
const mockListings = [
    { id: 1, type: 'For Sale', category: 'Produce', name: 'Organic Tomatoes', price: '₹ 30/kg', quantity: '500 kg available', contact: 'Ramesh Kumar, 9876543210', image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, type: 'For Sale', category: 'Equipment', name: 'Mahindra Tractor 275 DI', price: '₹ 3,50,000', quantity: '1 unit', contact: 'Sita Devi, 9123456789', image: 'https://images.unsplash.com/photo-1624899268804-45602f068383?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, type: 'Looking to Buy', category: 'Seeds', name: 'High-Yield Wheat Seeds', price: 'Contact for price', quantity: '100 kg needed', contact: 'Amit Singh, 8901234567' },
    { id: 4, type: 'For Sale', category: 'Livestock', name: 'Gir Cow', price: '₹ 55,000', quantity: '2 available', contact: 'Priya Sharma, 7890123456', image: 'https://images.unsplash.com/photo-1583243997538-e4b53402b85a?q=80&w=1954&auto=format&fit=crop' },
    { id: 5, type: 'Looking to Buy', category: 'Equipment', name: 'Used Power Tiller', price: 'Up to ₹ 40,000', quantity: '1 unit', contact: 'Vijay Patel, 6789012345' },
    { id: 6, type: 'For Sale', category: 'Produce', name: 'Fresh Mangoes (Alphonso)', price: '₹ 1,200/dozen', quantity: '100 dozen', contact: 'Sunita Reddy, 9988776655', image: 'https://images.unsplash.com/photo-1591078685550-844a4aa7a8d9?q=80&w=1974&auto=format&fit=crop' },
];

const categories = ['All', 'Produce', 'Equipment', 'Seeds', 'Livestock', 'Other'];

const ListingCard = ({ listing }: { listing: typeof mockListings[0] }) => {
    const { t } = useLanguage();
    return (
        <Card className="flex flex-col h-full overflow-hidden p-0">
            {listing.image && <img src={listing.image} alt={listing.name} className="w-full h-48 object-cover" />}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider rounded-full uppercase ${listing.type === 'For Sale' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'}`}>
                        {listing.type === 'For Sale' ? t('marketplace.filter.forSale') : t('marketplace.filter.toBuy')}
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{listing.category}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{listing.name}</h3>
                <p className="mt-2 text-lg font-semibold text-primary-600 dark:text-primary-400">{listing.price}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{listing.quantity}</p>
                <div className="flex-grow" />
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" size="sm" className="w-full">{t('marketplace.button.contact')}</Button>
                </div>
            </div>
        </Card>
    );
};

const PostAdModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit data to a backend.
        console.log("Ad submitted!");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('marketplace.modal.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('marketplace.modal.type')}</label>
                        <select className="mt-1 block w-full input-base" required>
                            <option>{t('marketplace.filter.forSale')}</option>
                            <option>{t('marketplace.filter.toBuy')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('marketplace.filter.category')}</label>
                        <select className="mt-1 block w-full input-base" required>
                            {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('marketplace.modal.itemName')}</label>
                        <input type="text" className="mt-1 block w-full input-base" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('marketplace.modal.price')}</label>
                        <input type="text" placeholder={t('marketplace.modal.price.placeholder')} className="mt-1 block w-full input-base" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('marketplace.modal.quantity')}</label>
                        <input type="text" placeholder={t('marketplace.modal.quantity.placeholder')} className="mt-1 block w-full input-base" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('marketplace.modal.description')}</label>
                        <textarea rows={3} className="mt-1 block w-full input-base"></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
                        <Button type="submit">{t('marketplace.button.postAd')}</Button>
                    </div>
                </form>
            </div>
            <style>{`.input-base { padding: 0.5rem 0.75rem; border: 1px solid; border-radius: 0.375rem; }
            .light .input-base { border-color: #d1d5db; background-color: transparent; color: #111827; }
            .dark .input-base { border-color: #4b5563; background-color: #374151; color: #f9fafb; }
            `}</style>
        </div>
    );
};


const MarketplacePage: React.FC = () => {
    const { t } = useLanguage();
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const translatedMockListings = useMemo(() => {
        return mockListings.map(listing => ({
            ...listing,
            type: listing.type === 'For Sale' ? t('marketplace.filter.forSale') : t('marketplace.filter.toBuy'),
        }))
    }, [t]);

    const filteredListings = useMemo(() => {
        const listingsToFilter = mockListings; // We filter based on original English values
        return listingsToFilter.filter(listing => {
            const typeMatch = filterType === 'All' || listing.type === filterType;
            const categoryMatch = filterCategory === 'All' || listing.category === filterCategory;
            return typeMatch && categoryMatch;
        });
    }, [filterType, filterCategory]);

    return (
        <div className="space-y-8">
            <PostAdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('marketplace.title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                    {t('marketplace.subtitle')}
                </p>
                 <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">{t('marketplace.demo')}</p>
            </div>
            
            <Card className="sticky top-16 z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Type Filter */}
                        <div className="flex items-center gap-2">
                           <label className="text-sm font-medium dark:text-gray-300">{t('marketplace.filter.show')}</label>
                           <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rounded-md border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 py-1.5 px-2 text-sm">
                               <option value="All">{t('all')}</option>
                               <option value="For Sale">{t('marketplace.filter.forSale')}</option>
                               <option value="Looking to Buy">{t('marketplace.filter.toBuy')}</option>
                           </select>
                        </div>
                         {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium dark:text-gray-300">{t('marketplace.filter.category')}</label>
                           <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="rounded-md border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 py-1.5 px-2 text-sm">
                               {categories.map(c => <option key={c} value={c}>{c === 'All' ? t('all') : c}</option>)}
                           </select>
                        </div>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>{t('marketplace.button.postAd')}</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.length > 0 ? (
                    filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} />)
                ) : (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">{t('marketplace.noMatch')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;