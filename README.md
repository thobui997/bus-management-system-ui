# BusManager System

## Tổng quan dự án

BusManager System là một hệ thống quản lý xe buýt toàn diện được xây dựng bằng React, TypeScript và Supabase. Hệ thống cung cấp các công cụ quản lý hoàn chỉnh cho việc vận hành dịch vụ xe buýt, từ quản lý phương tiện, tuyến đường, lịch trình đến đặt vé và thanh toán.

## Công nghệ sử dụng

* **Frontend Framework**: React 18.3.1
* **Language**: TypeScript 5.7.2
* **Build Tool**: Vite 6.2.0
* **Backend Service**: Supabase
* **UI Library**: Ant Design 5.27.4
* **State Management**: TanStack Query (React Query) 5.72.1
* **Routing**: React Router 7.5.0
* **Styling**: TailwindCSS 4.1.13, SASS 1.85.1
* **Date Library**: Day.js 1.11.13
* **HTTP Client**: Axios 1.8.4
* **Drag & Drop**: @dnd-kit

## Yêu cầu hệ thống

* **Node.js**: `^18.13.0` hoặc `^20.9.0`
* **Package Manager**: `npm`, `yarn`, hoặc `pnpm`

## Hướng dẫn cài đặt

### 1. Clone repository

```
git clone <repository-url>
cd bus-management-system-ui
```

### 2. Cài đặt dependencies

```
npm install
# hoặc
yarn install
# hoặc
pnpm install


```

### 3. Cấu hình môi trường

Tạo file `.env` từ file `.env.example`:

```
cp .env.example .env

```

Cập nhật các biến môi trường trong file `.env`:

```
VITE_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-key


```

### 4. Chạy ứng dụng

**Development mode**

```
npm run dev

```

Ứng dụng sẽ chạy tại `http://localhost:3000`

**Build production**

```
# Build cho môi trường development
npm run build:dev

# Build cho môi trường production
npm run build:prod


```

**Preview production build**

```
npm run preview


```

### 5. Linting

```
npm run lint


```

## Cấu trúc dự án

```
src/
├── app/                      # Application core
│   ├── pages/                # Route pages
│   │   ├── app/              # Protected pages
│   │   └── auth/             # Authentication pages
│   ├── provider.tsx          # App providers wrapper
│   └── router.tsx            # Route configuration
├── features/                 # Feature modules
│   ├── auth/                 # Authentication
│   ├── booking/              # Booking management
│   ├── customer-management/  # Customer management
│   ├── dashboard/            # Dashboard & analytics
│   ├── employee-management/  # Employee management
│   ├── payment/              # Payment management
│   ├── route-management/     # Route management
│   ├── station-management/   # Station management
│   ├── trip-scheduling/      # Trip scheduling
│   └── vehicle-management/   # Vehicle management
│       ├── vehicle-fleet/    # Fleet management
│       └── vehicle-type/     # Vehicle types
├── shared/                   # Shared resources
│   ├── api/                  # API services
│   ├── components/           # Reusable components
│   ├── layouts/              # Layout components
│   ├── types/                # TypeScript types
│   ├── enums/                # Enumerations
│   ├── utils/                # Utility functions
│   └── contants/             # Constants
├── config/                   # App configuration
│   ├── menu.ts               # Menu configuration
│   ├── paths.ts              # Route paths
│   ├── theme.ts              # Theme config
│   └── validate-message.ts   # Form validation messages
├── context/                  # React contexts
│   ├── auth-context.tsx      # Authentication context
│   └── notification-context.tsx # Notification context
├── hooks/                    # Custom hooks
│   ├── use-debounce.ts
│   ├── use-local-storage.ts
│   └── use-table-state.ts
├── lib/                      # External libraries config
│   ├── date-utils.ts         # Day.js configuration
│   ├── http-client.ts        # Axios instance
│   ├── react-query.ts        # React Query config
│   └── supabase-client.ts    # Supabase client
├── index.css                 # Global styles
└── main.tsx                  # Application entry point


```

## Các chức năng chính

### 1. Dashboard 📊

* Tổng quan thống kê hệ thống
* Hiển thị doanh thu (tổng, theo tháng)
* Thống kê khách hàng và nhân viên
* Tổng quan xe (tổng số, đang hoạt động, bảo trì, ngừng hoạt động)
* Thống kê chuyến đi (đúng giờ, trễ, hủy)
* Thống kê đặt vé (đã xác nhận, chờ thanh toán, đã hủy)
* Danh sách đặt vé gần đây
* Danh sách chuyến đi sắp tới

### 2. Quản lý Phương tiện (Vehicle Management) 🚌

#### a. Đội xe (Vehicle Fleet)

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách xe
* **Thông tin xe**:
   * Biển số xe
   * Loại xe
   * Hãng xe, mẫu xe
   * Năm sản xuất
   * Số ghế
   * Nhà sản xuất
   * Trạng thái (Hoạt động, Ngừng hoạt động, Bảo trì)
* **Tìm kiếm & lọc**:
   * Tìm kiếm theo biển số, hãng, mẫu
   * Lọc theo trạng thái
   * Lọc theo loại xe
* **Phân trang** với các tùy chọn: 10, 20, 50, 100 bản ghi/trang

#### b. Nhật ký Bảo trì (Maintenance Logs)

* **CRUD operations**: Thêm, sửa, xóa, xem nhật ký bảo trì
* **Thông tin bảo trì**:
   * Xe cần bảo trì
   * Loại bảo trì
   * Ngày lên lịch
   * Ngày hoàn thành
   * Chi phí
   * Trạng thái (Đã lên lịch, Đang thực hiện, Hoàn thành)
   * Ghi chú
* **Tìm kiếm & lọc**:
   * Tìm kiếm theo loại bảo trì, ghi chú
   * Lọc theo trạng thái
   * Lọc theo xe

#### c. Loại Phương tiện (Vehicle Types)

* **CRUD operations**: Quản lý các loại xe
* **Thông tin loại xe**:
   * Tên loại xe
   * Mô tả
* **Tìm kiếm**: Theo tên, mô tả

### 3\. Quản lý Trạm (Station Management) 🏢

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách trạm
* **Thông tin trạm**:
   * Tên trạm
   * Địa chỉ
* **Tìm kiếm**: Theo tên trạm, địa chỉ
* **Phân trang** linh hoạt

### 4\. Quản lý Tuyến đường (Route Management) 🗺️

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách tuyến
* **Thông tin tuyến**:
   * Tên tuyến
   * Trạm xuất phát
   * Trạm đến
   * Khoảng cách (km)
   * Thời gian tiêu chuẩn (phút)
* **Quản lý điểm dừng**:
   * Thêm/xóa điểm dừng trung gian
   * Sắp xếp thứ tự điểm dừng (drag & drop)
   * Hiển thị timeline tuyến đường
* **Tìm kiếm**: Theo tên tuyến
* **Hiển thị** số lượng điểm dừng của mỗi tuyến

### 5\. Quản lý Nhân viên (Employee Management) 👥

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách nhân viên
* **Thông tin nhân viên**:
   * Họ tên
   * Email
   * Số điện thoại
   * Số bằng lái
   * Ngày hết hạn bằng lái
* **Tìm kiếm**: Theo tên, email, số điện thoại, số bằng lái
* **Cảnh báo**: Bằng lái sắp hết hạn (trong vòng 30 ngày)
* **Phân trang** đầy đủ

### 6\. Lập lịch Chuyến đi (Trip Scheduling) 📅

#### a. Danh sách Chuyến đi

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách chuyến
* **Thông tin chuyến**:
   * Tuyến đường
   * Xe
   * Thời gian khởi hành/đến
   * Thời lượng
   * Trạng thái (Đúng giờ, Trễ, Hủy)
   * Danh sách phân công (tài xế, phụ xe)
* **Quản lý phân công nhân viên**:
   * Thêm/xóa nhân viên cho chuyến
   * Phân công vai trò (Tài xế, Phụ xe)
   * Hiển thị thông tin chi tiết nhân viên
   * Kiểm tra xung đột vai trò (chỉ 1 tài xế/chuyến)
* **Tìm kiếm & lọc**:
   * Tìm kiếm theo tuyến, biển số xe
   * Lọc theo trạng thái
   * Lọc theo tuyến đường
   * Lọc theo xe

#### b. Lịch Chuyến đi (Calendar View)

* **Hiển thị lịch**: Xem chuyến đi theo ngày/tháng
* **Badge màu**: Phân biệt trạng thái chuyến
* **Chi tiết**: Click vào ngày để xem chi tiết các chuyến

### 7\. Quản lý Khách hàng (Customer Management) 👤

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách khách hàng
* **Thông tin khách hàng**:
   * Họ tên
   * Số điện thoại
   * Email
   * Điểm thưởng (Loyalty Points)
* **Tìm kiếm**: Theo tên, số điện thoại, email
* **Hiển thị điểm thưởng**: Badge với số điểm

### 8\. Quản lý Đặt vé (Ticketing & Booking) 🎫

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách đặt vé
* **Thông tin đặt vé**:
   * Khách hàng
   * Chuyến đi
   * Thời gian đặt
   * Tổng tiền
   * Trạng thái (Đã xác nhận, Chờ thanh toán, Đã hủy)
* **Quản lý vé**:
   * Thêm nhiều vé cho một booking
   * Thông tin mỗi vé:
         * Số ghế
         * Giá vé
         * Mã QR (tùy chọn)
   * Sắp xếp thứ tự vé
   * Kiểm tra trùng số ghế
   * Tự động tính tổng tiền
* **Tìm kiếm & lọc**:
   * Tìm kiếm theo khách hàng
   * Lọc theo trạng thái
* **Xem chi tiết**: Drawer hiển thị đầy đủ thông tin booking và danh sách vé
* **Thanh toán nhanh**: Nút tạo thanh toán trực tiếp từ booking

### 9\. Quản lý Thanh toán (Payment Management) 💳

* **CRUD operations**: Thêm, sửa, xóa, xem danh sách thanh toán
* **Thông tin thanh toán**:
   * Booking liên quan
   * Phương thức (Tiền mặt, Ví điện tử, Chuyển khoản)
   * Số tiền
   * Thời gian giao dịch
   * Trạng thái (Thành công, Thất bại)
* **Tự động cập nhật**: Trạng thái booking khi thanh toán
* **Validation**: Kiểm tra số tiền thanh toán khớp với tổng tiền booking
* **Tìm kiếm & lọc**:
   * Tìm kiếm theo khách hàng
   * Lọc theo trạng thái thanh toán
   * Lọc theo phương thức
   * Lọc theo khoảng thời gian
* **Phân trang** đầy đủ

## Tính năng chung

### 🔐 Authentication

* Đăng nhập với email/password
* Lưu token authentication
* Protected routes
* Redirect sau khi đăng nhập

### 🎨 UI/UX

* **Responsive design**: Hỗ trợ đa thiết bị
* **Dark/Light theme**: Tùy chỉnh màu sắc
* **Loading states**: Skeleton, Spinner
* **Empty states**: Thông báo khi không có dữ liệu
* **Toast notifications**: Thông báo thành công/lỗi
* **Confirmation dialogs**: Xác nhận trước khi xóa
* **Modal forms**: Form thêm/sửa trong modal
* **Drawer details**: Xem chi tiết trong drawer

### 📊 Data Management

* **Real-time updates**: Tự động cập nhật dữ liệu
* **Optimistic updates**: Cập nhật UI ngay lập tức
* **Cache management**: Quản lý cache với React Query
* **Pagination**: Phân trang linh hoạt
* **Search & Filter**: Tìm kiếm và lọc mạnh mẽ
* **Sort**: Sắp xếp dữ liệu
* **Debounced search**: Tối ưu tìm kiếm

### 🎯 Form Validation

* **Required fields**: Kiểm tra trường bắt buộc
* **Email validation**: Kiểm tra định dạng email
* **Phone validation**: Kiểm tra số điện thoại (10-15 số)
* **Number validation**: Kiểm tra số dương
* **Date validation**: Kiểm tra logic ngày tháng
* **Custom rules**: Quy tắc tùy chỉnh theo từng form

### 🔧 Developer Experience

* **TypeScript**: Type safety đầy đủ
* **ESLint**: Code linting
* **Prettier**: Code formatting
* **Hot Module Replacement**: Cập nhật nhanh khi dev
* **Error Boundary**: Xử lý lỗi gracefully
* **Code splitting**: Lazy loading routes

## Cấu trúc Feature Module

Mỗi feature module tuân theo cấu trúc:

```
feature-name/
├── api/                  # API calls
│   ├── create-*.api.ts
│   ├── update-*.api.ts
│   ├── delete-*.api.ts
│   └── get-*.api.ts
├── components/           # Feature components
│   ├── *-form-modal.tsx
│   ├── *-list.tsx
│   └── *-filter.tsx
├── hooks/                # Custom hooks
│   ├── use-column.tsx
│   ├── use-create-*-form.tsx
│   └── use-update-*-form.tsx
└── types/                # TypeScript types
    └── *.type.ts


```

## Scripts hữu ích

```
# Chạy dev server
npm run dev

# Build production
npm run build:prod

# Build development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint


```

## Quy tắc Code

* **File naming**: `kebab-case` cho files và folders
* **Component naming**: `PascalCase`
* **Function naming**: `camelCase`
* **Constant naming**: `UPPER_SNAKE_CASE`
* **Indentation**: 2 spaces
* **Line length**: Max 120 characters
* **Import order**: External > Internal > Relative

## Deployment

### Build production

```
npm run build:prod


```

Các file build sẽ được tạo trong thư mục `dist/`

### Environment Variables

Đảm bảo cấu hình đúng các biến môi trường cho production:

* `VITE_SUPABASE_URL`: URL Supabase project
* `VITE_SUPABASE_ANON_KEY`: Anon key từ Supabase

## Troubleshooting

### Lỗi khi cài đặt dependencies

```
# Xóa node_modules và lock file
rm -rf node_modules package-lock.json
# Cài đặt lại
npm install


```

### Lỗi kết nối Supabase

* Kiểm tra file `.env` đã được cấu hình đúng
* Kiểm tra URL và API key trên Supabase dashboard
* Kiểm tra network connection

### Lỗi TypeScript

```
# Xóa cache TypeScript
rm -rf node_modules/.tmp
# Chạy lại type check
npx tsc --noEmit
```

