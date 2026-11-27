# Database Schema - ACC Moment WCC

## Tables

### packages (Paket Layanan)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name | text | Nama paket (e.g. "Paket Silver") |
| description | text | Deskripsi singkat |
| price | integer | Harga dalam Rupiah |
| facilities | jsonb | Array fasilitas [{name, included}] |
| sort_order | integer | Urutan tampil |
| is_active | boolean | Aktif/nonaktif |
| created_at | timestamptz | |

### bookings (Pemesanan)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| booking_code | text UNIQUE | Kode booking (e.g. "ACC-20261117-001") |
| pin | text | PIN 4 digit (hashed) untuk login klien |
| client_name | text | Nama klien |
| client_phone | text | No WA klien |
| event_date | date | Tanggal acara |
| event_location | text | Lokasi acara |
| event_type | text | Jenis acara (Pernikahan, Engagement, dll) |
| package_id | uuid FK | Referensi ke paket |
| status | text | 'pending' / 'confirmed' / 'in_progress' / 'completed' / 'cancelled' |
| payment_status | text | 'unpaid' / 'dp_paid' / 'paid' |
| total_price | integer | Total harga |
| dp_amount | integer | Jumlah DP |
| notes | text | Catatan dari klien |
| drive_link_raw | text | Link Google Drive file mentah |
| drive_link_edited | text | Link Google Drive hasil edit |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### payment_proofs (Bukti Pembayaran)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| booking_id | uuid FK | |
| amount | integer | Jumlah transfer |
| proof_url | text | URL file bukti transfer |
| payment_type | text | 'dp' / 'full' |
| status | text | 'pending' / 'verified' / 'rejected' |
| verified_at | timestamptz | |
| created_at | timestamptz | |

### revisions (Catatan Revisi)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| booking_id | uuid FK | |
| message | text | Catatan revisi dari klien |
| status | text | 'pending' / 'in_progress' / 'done' |
| admin_reply | text | Balasan admin |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### team_members (Anggota Tim)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name | text | Nama anggota |
| role | text | 'shooter' / 'editor' / 'pilot' |
| phone | text | No HP |
| is_active | boolean | |
| created_at | timestamptz | |

### event_assignments (Penugasan Tim per Acara)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| booking_id | uuid FK | |
| team_member_id | uuid FK | |
| role_in_event | text | Peran di acara ini |
| created_at | timestamptz | |

### expenses (Pengeluaran Operasional)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| booking_id | uuid FK | Null jika pengeluaran umum |
| category | text | 'transport' / 'consumption' / 'fee' / 'equipment' / 'other' |
| description | text | Keterangan |
| amount | integer | Jumlah pengeluaran |
| date | date | Tanggal pengeluaran |
| created_at | timestamptz | |

### portfolio_items (Portofolio)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| title | text | Judul/nama project |
| description | text | Deskripsi singkat |
| video_url | text | URL embed TikTok/Reels/YouTube |
| thumbnail_url | text | URL thumbnail |
| event_type | text | Jenis acara |
| sort_order | integer | |
| is_featured | boolean | Tampil di halaman depan |
| created_at | timestamptz | |

### admin_users (Admin)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| email | text UNIQUE | |
| name | text | |
| role | text | 'owner' / 'admin' |
| created_at | timestamptz | |
