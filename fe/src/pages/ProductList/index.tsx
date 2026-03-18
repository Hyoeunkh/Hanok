import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useToast } from '@/components/common/Toast';
import ProductCard from '@/components/ProductList/ProductCard';
import ProductRegistrationModal from '@/components/ProductList/ProductRegistrationModal';
import { useDeleteItem } from '@/api/hooks/useDeleteItem';
import { useGetItems } from '@/api/hooks/useGetItems';
import SideBar from '@/components/common/layouts/SideBar';
import { sellerSidebarItems } from '@/components/common/layouts/sellerSidebarItems';

export default function ProductListPage() {
  const [activeMenu, setActiveMenu] = useState('inventory');
  const [activeTab, setActiveTab] = useState<'ALL' | 'READY' | 'PENDING' | 'SOLD'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProductInitData, setEditProductInitData] = useState<Product | null>(null);
  const itemsPerPage = 7;

  const { data: fetchedProducts } = useGetItems();
  const products = fetchedProducts || [];

  const { mutateAsync: deleteItem } = useDeleteItem();
  const { showToast } = useToast();

  const handleDelete = async (id: number) => {
    if (confirm('품목을 정말 삭제하시겠습니까?')) {
      try {
        await deleteItem(id);
        showToast({ message: '삭제되었습니다.' });
      } catch (err) {
        console.error(err);
        showToast({ message: '삭제에 실패했습니다.' });
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  const countByStatus = {
    READY: products.filter((p) => p.status === 'READY').length,
    PENDING: products.filter((p) => p.status === 'PENDING').length,
    SOLD: products.filter((p) => p.status === 'SOLD').length,
  };

  const tabs = [
    { id: 'ALL', label: '전체' },
    { id: 'READY', label: `대기(${countByStatus.READY})` },
    { id: 'PENDING', label: `경매중(${countByStatus.PENDING})` },
    { id: 'SOLD', label: `판매 완료(${countByStatus.SOLD})` },
  ] as const;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="flex w-full max-w-[1200px] mx-auto gap-0 py-10 px-4 min-h-screen">
      <SideBar
        items={sellerSidebarItems}
        activeItemId={activeMenu}
        onItemClick={(item) => setActiveMenu(item.id)}
        className="!w-[200px] shrink-0 !pr-4 !pl-0 !py-0 !max-w-none"
      />
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[24px] font-semibold text-warm m-0 mb-2">내 인벤토리</h2>
            <p className="text-body-md text-neutral-500 m-0">라이브 경매를 위해 등록된 품목입니다.</p>
          </div>
          <button
            onClick={() => {
              setEditProductInitData(null);
              setIsModalOpen(true);
            }}
            className="btn-primary-outline flex items-center gap-1.5 rounded-[10px] px-5 py-2.5 text-sm font-semibold cursor-pointer"
          >
            <FaPlus size={12} />새 물품 등록
          </button>
        </div>

        <div className="bg-surface-elevated rounded-2xl border border-neutral-800 px-6 pb-6 flex flex-col">
          <div className="flex gap-1 pt-4 mb-6">
            <div className="relative inline-flex items-center rounded-xl bg-warm/6 p-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as typeof activeTab); setCurrentPage(1); }}
                    className="relative z-10 rounded-lg px-4 py-2 text-subtitle-sm transition cursor-pointer border-none bg-transparent"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="inventoryTab"
                        initial={false}
                        className="absolute inset-0 rounded-lg bg-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-neutral-100' : 'text-neutral-400 hover:text-neutral-200'}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="flex flex-col">
                {filteredProducts
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((product) => (
                    <ProductCard
                      key={product.itemId}
                      product={product}
                      onEdit={() => {
                        setEditProductInitData(product);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4 mt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 bg-transparent border border-neutral-700 text-neutral-400 text-[13px] rounded-lg cursor-pointer hover:bg-warm/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-[13px] border-none cursor-pointer transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-neutral-100 font-bold'
                          : 'bg-transparent text-neutral-400 hover:bg-warm/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 bg-transparent border border-neutral-700 text-neutral-400 text-[13px] rounded-lg cursor-pointer hover:bg-warm/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center py-16">
              <p className="text-body-lg text-neutral-500">새 물품을 등록 해주세요.</p>
            </div>
          )}
        </div>
      </div>

      <ProductRegistrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditProductInitData(null);
        }}
        initialData={editProductInitData}
      />
    </div>
  );
}
