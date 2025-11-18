// mock_orders.js
const orders = [
    {
        id: "ORD001",
        customer: "Nguyễn Văn A",
        email: "vana@example.com",
        total: 1250000,
        status: "Chờ xác nhận",
        date: "2025-10-20",
        items: [
            { name: "iPhone 15 Pro Max", quantity: 1, price: 32990000 },
            { name: "Apple MagSafe Battery Pack", quantity: 1, price: 9999000 },
        ],
    },
    {
        id: "ORD002",
        customer: "Trần Thị B",
        email: "thib@example.com",
        total: 450000,
        status: "Đã xác nhận",
        date: "2025-10-21",
        items: [
            { name: "Beats Flex Wireless Earphones", quantity: 2, price: 4999000 },
        ],
    },
    {
        id: "ORD003",
        customer: "Lê Minh C",
        email: "minhc@example.com",
        total: 820000,
        status: "Chờ xác nhận",
        date: "2025-10-22",
        items: [
            { name: "Apple iPhone Charger", quantity: 2, price: 199900 },
            { name: "iPhone 12 Silicone Case", quantity: 1, price: 299900 },
        ],
    },
    {
        id: "ORD004",
        customer: "Phạm Quang D",
        email: "quangd@example.com",
        total: 920000,
        status: "Đã xác nhận",
        date: "2025-10-22",
        items: [
            { name: "MacBook Pro M3 2024", quantity: 1, price: 48990000 },
        ],
    },
];

export default orders;
