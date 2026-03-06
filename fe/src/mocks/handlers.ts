import { http, HttpResponse, delay } from "msw";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

let mockItems: any[] = [];

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({ ok: true });
  }),

  // -- Item CRUD Mocks --
  http.get(`${BASE_URL}/v1/items`, async () => {
    await delay(300);
    return HttpResponse.json(mockItems);
  }),

  http.post(`${BASE_URL}/v1/items`, async ({ request }) => {
    await delay(500);
    // Simulate getting form data
    const formData = await request.formData();
    const title = formData.get('title') as string || 'Mock Uploaded Item';
    const description = formData.get('description') as string || 'Mock Description';
    const startPrice = Number(formData.get('startPrice')) || 0;
    const bidUnit = Number(formData.get('bidUnit')) || 1000;
    const auctionTime = Number(formData.get('auctionDuration')) || 30;
    
    // Check if there are newImages
    const newImages = formData.getAll('newImages');
    let imageUrls: string[] = [];
    if (newImages.length > 0) {
      imageUrls = newImages.map(file => URL.createObjectURL(file as Blob));
    } else {
      imageUrls = ['https://via.placeholder.com/160x160?text=Mock+Image'];
    }

    const newItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      status: 'WAITING',
      title,
      description,
      tags: ['신규등록', '테스트'],
      imageUrls,
      startPrice,
      bidUnit,
      auctionTime,
      condition: '새상품',
      category: '카테고리명',
      auctionMethod: '영국식',
    };
    
    mockItems.push(newItem);

    return HttpResponse.json({
      itemId: newItem.id,
      title: newItem.title,
      status: newItem.status
    });
  }),
  
  http.put(`${BASE_URL}/v1/items/:itemId`, async ({ params }) => {
    await delay(500);
    const id = Number(params.itemId);
    const itemIndex = mockItems.findIndex(i => i.id === id);
    if (itemIndex > -1) {
      mockItems[itemIndex] = { ...mockItems[itemIndex], title: "Mock Edited Item" };
    }
    return HttpResponse.json({
      itemId: id,
      title: "Mock Edited Item",
      status: "ready"
    });
  }),

  http.delete(`${BASE_URL}/v1/items/:itemId`, async ({ params }) => {
    await delay(500);
    const id = Number(params.itemId);
    mockItems = mockItems.filter(i => i.id !== id);
    return HttpResponse.json({
      itemId: id,
      status: "cancelled"
    });
  }),
];
