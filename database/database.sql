--
-- PostgreSQL database dump
--

\restrict l7SMKLm9SJHLQSLnjQJFKxAcZrEG0HbIgbdCFaba6vItD21uAgshBVBsJribBtf

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

-- Started on 2026-07-17 15:27:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 24619)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    product_price double precision NOT NULL,
    quantity integer NOT NULL,
    line_total double precision NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24618)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 223
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 222 (class 1259 OID 24604)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status character varying(20) NOT NULL,
    total_amount double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24603)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 221
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price double precision NOT NULL,
    cost_price double precision NOT NULL,
    category character varying(50) NOT NULL,
    stock integer NOT NULL,
    image_path character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 220 (class 1259 OID 16413)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    is_active boolean,
    role character varying NOT NULL,
    full_name character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16412)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4763 (class 2604 OID 24622)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 24607)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 16392)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 16416)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4934 (class 0 OID 24619)
-- Dependencies: 224
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, product_name, product_price, quantity, line_total) FROM stdin;
1	1	19	Chuột Không Dây Apple Magic Mouse 2	1990000	1	1990000
2	2	19	Chuột Không Dây Apple Magic Mouse 2	1990000	1	1990000
3	3	20	iPad Air 6 M2 11-inch (2024)	16990000	1	16990000
5	5	3	iPhone 16 Pro Max 256GB	34990000	5	174950000
6	6	2	Apple Vision Pro 256GB	89990000	1	89990000
7	7	7	iPad Pro 13 inch M4 Wifi 256GB	37990000	1	37990000
8	8	8	Apple Watch Series 10 GPS 42mm	10990000	2	21980000
9	9	6	MacBook Pro 14 inch M3 Pro (18GB/512GB)	49990000	1	49990000
4	4	8	Apple Watch Series 10 GPS 42mm	10990000	20	219800000
10	10	19	Chuột Không Dây Apple Magic Mouse 2	1990000	3	5970000
11	10	3	iPhone 16 Pro Max 256GB	34990000	3	104970000
12	10	5	MacBook Air 13 inch M3 (8GB/256GB)	27490000	3	82470000
13	10	9	AirPods Pro Gen 2 MagSafe (USB-C)	5790000	3	17370000
14	11	20	iPad Air 6 M2 11-inch (2024)	16990000	2	33980000
15	11	22	iPad mini 7 Wifi 128GB (A17 Pro)	13990000	2	27980000
\.


--
-- TOC entry 4932 (class 0 OID 24604)
-- Dependencies: 222
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, status, total_amount, created_at) FROM stdin;
1	1	PLACED	1990000	2026-07-16 04:12:23.13749+07
2	1	PLACED	1990000	2026-07-16 04:17:49.318262+07
3	1	PLACED	16990000	2026-07-16 04:19:59.104162+07
5	1	PLACED	174950000	2026-07-16 04:53:48.150758+07
6	1	PLACED	89990000	2026-07-16 05:06:29.533257+07
7	1	PLACED	37990000	2026-07-16 05:17:32.272308+07
8	1	CANCELED	21980000	2026-07-16 05:31:29.337337+07
9	1	CANCELED	49990000	2026-07-16 05:50:47.463184+07
4	1	COMPLETED	219800000	2026-07-16 04:44:44.46234+07
10	1	PLACED	210780000	2026-07-16 06:32:32.240723+07
11	1	PLACED	61960000	2026-07-17 14:49:43.573815+07
\.


--
-- TOC entry 4928 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, cost_price, category, stock, image_path, created_at, updated_at) FROM stdin;
4	iPhone 15 Plus 128GB	Điện thoại pin trâu nhất dòng iPhone với màn hình lớn 6.7 inch, sở hữu Dynamic Island thời thượng và cổng sạc USB-C mới.	22990000	20000000	Phone	35	http://localhost:8000/images/a94b3f21-27d8-4ff9-82fb-1e16b1a78f5e.webp	2026-07-10 17:48:18.41659+07	2026-07-10 17:48:18.41659+07
2	Apple Vision Pro 256GB	Siêu phẩm flagship năm 2024 với chip Apple A18 Pro mãnh mẽ, camera điều khiển nút bấm mới và màn hình 6.9 inch cực đại.  price: 34990000	89990000	82000000	Accessory	4	http://localhost:8000/images/3607479f-24dd-428f-9a73-1011543648cb.png	2026-07-10 17:44:16.052239+07	2026-07-16 05:06:29.533257+07
12	iPhone 15 Pro Max 256GB	Thiết kế khung titan bền bỉ, siêu nhẹ. Chip A17 Pro mang lại hiệu năng gaming đỉnh cao. Hệ thống camera zoom quang học 5x sắc nét.	29990000	23992000	Phone	10	http://localhost:8000/images/5e56ca12-a3ab-40dd-9fe5-86c65818e65b.jpg	2026-07-13 03:39:34.530719+07	2026-07-13 03:39:34.530719+07
13	MacBook Air M3 13-inch (2024)	Siêu mỏng nhẹ, trang bị chip M3 thế hệ mới cân mượt mọi tác vụ học tập, văn phòng và đồ họa 2D. Thời lượng pin lên đến 18 tiếng.	27490000	21992000	Laptop	10	http://localhost:8000/images/14a500c2-2ea0-4912-bc7c-4dd7c8534397.jpg	2026-07-13 03:40:30.322498+07	2026-07-13 03:40:30.322498+07
14	iPad Air 6 M2 11-inch (2024)	Sức mạnh từ chip M2 đỉnh cao, màn hình Liquid Retina sắc nét. Hỗ trợ Apple Pencil Pro mới giúp ghi chú và vẽ sáng tạo không giới hạn.	16990000	13592000	Tablet	10	http://localhost:8000/images/64b53bf6-93cd-4d9a-a28a-68ad143b73ed.webp	2026-07-13 03:41:20.176333+07	2026-07-13 03:41:20.176333+07
15	Apple Watch Series 9 GPS	Đồng hồ thông minh thế hệ mới với tính năng Chạm Hai Lần (Double Tap) độc đáo. Màn hình sáng gấp đôi, hỗ trợ theo dõi sức khỏe chuyên sâu.	9490000	7592000	Accessory	10	http://localhost:8000/images/1d3fc5e8-d0fd-4f93-bc49-c9a5f7afff7e.webp	2026-07-13 03:41:59.901404+07	2026-07-13 03:41:59.901404+07
16	AirPods Pro (2nd Generation) MagSafe (USB-C)	Tai nghe không dây chống ồn chủ động tốt hơn gấp 2 lần. Cổng sạc USB-C đồng bộ tiện lợi, âm thanh vòm cá nhân hóa sống động.	5690000	4552000	Phone	10	http://localhost:8000/images/e63a6471-0427-4f9f-9885-e0eb337dee5e.webp	2026-07-13 03:42:47.301597+07	2026-07-13 03:42:47.301597+07
17	Củ Sạc Nhanh Apple 20W USB-C	Phụ kiện chính hãng Apple giúp sạc nhanh tối ưu cho iPhone và iPad. Thiết kế nhỏ gọn, an toàn cháy nổ tuyệt đối.	520000	416000	Phone	10	http://localhost:8000/images/d4cc0c38-a70a-4a88-978f-6734e28fbe35.webp	2026-07-13 03:43:39.206292+07	2026-07-13 03:43:39.206292+07
18	Chuột Không Dây Apple Magic Mouse 2	Thiết kế công thái học hiện đại, bề mặt cảm ứng đa điểm hỗ trợ cuộn dọc mượt mà trên MacOS. Trọng lượng siêu nhẹ, pin sạc dùng cả tháng.	1990000	1592000	Accessory	10	http://localhost:8000/images/f1f1a3b8-29e5-4219-b50d-464971a1d8e9.jpg	2026-07-13 03:44:21.328505+07	2026-07-13 03:44:21.328505+07
7	iPad Pro 13 inch M4 Wifi 256GB	Chiếc iPad mỏng nhất lịch sử Apple, màn hình Tandem OLED đỉnh thế giới kết hợp chip M4 xử lý AI cực đỉnh.	37990000	34000000	Tablet	24	http://localhost:8000/images/aaaadbf2-a064-44ab-9204-3b5468ea8fb7.jpg	2026-07-10 17:52:59.302813+07	2026-07-16 05:17:32.272308+07
8	Apple Watch Series 10 GPS 42mm	Đồng hồ thông minh thế hệ mới với màn hình to hơn, thiết kế siêu mỏng và tính năng cảnh báo ngưng thở khi ngủ.	10990000	9500000	Wearable	43	http://localhost:8000/images/71091e0e-cefc-4f2d-aa80-38effa720373.webp	2026-07-10 17:54:31.336583+07	2026-07-16 06:31:00.321246+07
6	MacBook Pro 14 inch M3 Pro (18GB/512GB)	Cỗ máy quái vật dành cho dân lập trình và đồ họa chuyên nghiệp, màn hình Liquid Retina XDR 120Hz siêu mượt.	49990000	44000000	Laptop	14	http://localhost:8000/images/ff10d555-4ded-4bcd-b353-dfd7763eb81b.jpg	2026-07-10 17:51:07.027212+07	2026-07-16 05:50:47.463184+07
5	MacBook Air 13 inch M3 (8GB/256GB)	Mẫu laptop mỏng nhẹ quốc dân nay được nâng cấp lên chip M3 mạnh mẽ, hỗ trợ xuất 2 màn hình ngoài đỉnh cao.	27490000	24500000	Laptop	17	http://localhost:8000/images/51214fde-949c-4653-a85b-09aedb91f37f.jpg	2026-07-10 17:49:53.364306+07	2026-07-16 06:54:43.931119+07
20	iPad Air 6 M2 11-inch (2024)	Sức mạnh từ chip M2 đỉnh cao, màn hình Liquid Retina sắc nét. Hỗ trợ Apple Pencil Pro mới giúp ghi chú và vẽ sáng tạo không giới hạn.	16990000	13592000	Tablet	8	http://localhost:8000/images/a90428ff-13d6-4906-8dea-eedd038ef761.webp	2026-07-13 03:47:57.507292+07	2026-07-17 14:49:43.573815+07
19	Chuột Không Dây Apple Magic Mouse 2	Thiết kế công thái học hiện đại, bề mặt cảm ứng đa điểm hỗ trợ cuộn dọc mượt mà trên MacOS. Trọng lượng siêu nhẹ, pin sạc dùng cả tháng.	1990000	1592000	Accessory	7	http://localhost:8000/images/1a51b37a-afab-4610-b139-9eb75ce08953.jpg	2026-07-13 03:46:35.94237+07	2026-07-16 06:54:41.928017+07
22	iPad mini 7 Wifi 128GB (A17 Pro)	iPad mini 7 (A17 Pro)</strong> - Chiếc máy tính bảng nhỏ gọn, mạnh mẽ nhất thế giới của Apple nay đã quay trở lại. Với kích thước màn hình chỉ 8.3 inch cực kỳ di động, thiết bị sẵn sàng đồng hành cùng bạn ở bất cứ nơi đâu.	13990000	11192000	Tablet	48	http://localhost:8000/images/b0953b31-fa57-4885-831e-4df1f0cf58fb.webp	2026-07-17 13:58:07.546732+07	2026-07-17 14:49:43.573815+07
9	AirPods Pro Gen 2 MagSafe (USB-C)	Tai nghe chống ồn chủ động tốt nhất hiện tại, chất âm đỉnh cao, hộp sạc nâng cấp lên cổng USB-C tiện lợi.	5790000	4900000	Accessory	97	http://localhost:8000/images/0e7c2cd4-4ba4-4952-8338-619030d3fa13.webp	2026-07-10 17:57:12.134771+07	2026-07-16 06:54:44.858912+07
3	iPhone 16 Pro Max 256GB	Siêu phẩm flagship năm 2024 với chip Apple A18 Pro mãnh mẽ, camera điều khiển nút bấm mới và màn hình 6.9 inch cực đại.	34990000	31000000	Phone	42	http://localhost:8000/images/1c1e17dd-cfa8-4c23-8d26-6b4bde81e3b5.webp	2026-07-10 17:46:29.092146+07	2026-07-16 06:54:42.950844+07
21	iPad mini 7 Wifi 128GB (A17 Pro)	 Chiếc máy tính bảng nhỏ gọn, mạnh mẽ nhất thế giới của Apple nay đã quay trở lại. Với kích thước màn hình chỉ 8.3 inch cực kỳ di động, thiết bị sẵn sàng đồng hành cùng bạn ở bất cứ nơi đâu.\r\n	13.99	11	Laptop	50	http://localhost:8000/images/1642f02d-a085-4690-9e5c-471a6ef3236d.webp	2026-07-17 13:56:44.657439+07	2026-07-17 13:56:44.657439+07
\.


--
-- TOC entry 4930 (class 0 OID 16413)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, hashed_password, is_active, role, full_name) FROM stdin;
1	test1234@gmail.com	c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646	t	CUSTOMER	\N
2	ADMIN1@gmail.com	c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646	t	ADMIN	\N
3	test1234567@gmail.com	c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646	t	CUSTOMER	\N
4	testtest@gmail.com	15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225	t	CUSTOMER	\N
\.


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 223
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 15, true);


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 221
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 22, true);


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4778 (class 2606 OID 24624)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 24610)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4766 (class 2606 OID 16398)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4770 (class 2606 OID 16420)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4775 (class 1259 OID 24636)
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- TOC entry 4776 (class 1259 OID 24635)
-- Name: ix_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_order_id ON public.order_items USING btree (order_id);


--
-- TOC entry 4771 (class 1259 OID 24616)
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- TOC entry 4772 (class 1259 OID 24617)
-- Name: ix_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_user_id ON public.orders USING btree (user_id);


--
-- TOC entry 4764 (class 1259 OID 16399)
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- TOC entry 4767 (class 1259 OID 16422)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4768 (class 1259 OID 16421)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4780 (class 2606 OID 24625)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4781 (class 2606 OID 24630)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4779 (class 2606 OID 24611)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-07-17 15:27:54

--
-- PostgreSQL database dump complete
--

\unrestrict l7SMKLm9SJHLQSLnjQJFKxAcZrEG0HbIgbdCFaba6vItD21uAgshBVBsJribBtf

