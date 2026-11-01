Berikut PRD (Product Requirements Document) untuk proyek Browser-Based OS, yaitu sistem operasi virtual yang berjalan sepenuhnya di browser dengan tampilan terinspirasi dari macOS, desain minimalis, dan tema dark.

Saya buat PRD ini agar bisa langsung digunakan sebagai acuan pengembangan oleh developer atau AI coding tools seperti Cursor, Claude Code, maupun Lovable.

Tras más de 20 años usando Windows, me acabé pasando a Mac. Un mes después vi lo mucho que me estaba perdiendo

Examining Dark Mode Implementations of Mac Productivity Apps - MacStories

Multi-Agent 实测：不会带团队，模型干到死 | 雷峰网

# NOVA OS

Browser-Based Operating System · Product Requirements Document

Web ApplicationDark ThemeDesktop ExperienceVersion 1.0

# 1. Product Overview

Nama Produk: NOVA OS

Konsep Produk:

NOVA OS adalah sistem operasi virtual berbasis web yang memberikan pengalaman menggunakan desktop OS langsung dari browser tanpa perlu instalasi.

Tampilan dan interaksi terinspirasi dari macOS dengan pendekatan desain yang lebih sederhana, modern, elegan, dan minimalis.

Pengguna dapat membuka aplikasi, mengelola file, berpindah jendela, mengatur desktop, dan melakukan berbagai aktivitas layaknya menggunakan sistem operasi sungguhan.

Platform:

- Desktop browser (prioritas utama).
- Tablet (responsif).
- Mobile (mode terbatas).

# 2. Design Direction

## Visual Design

Bog - YouTube

How do I get macOS Sonoma (14.0) to keep the same font size in the finder? - Ask Different

MacOS Portfolio Desktop — built with AI on Blink

Konsep visual yang digunakan:

- Terinspirasi dari macOS Sonoma dan macOS Sequoia.
- Dominasi warna hitam dan abu-abu gelap.
- Tampilan bersih dan tidak terlalu banyak elemen.
- Rounded corners pada window dan komponen.
- Efek blur atau glassmorphism secara halus.
- Animasi transisi yang smooth.
- Ikon aplikasi minimalis dan konsisten.

## Color Palette

| Elemen | Warna |
| --- | --- |
| Desktop background | `#09090B` |
| Window background | `#18181B` |
| Sidebar | `#111113` |
| Primary text | `#FAFAFA` |
| Secondary text | `#A1A1AA` |
| Border | `#27272A` |
| Accent | `#3B82F6` |
| Dock background | `#202024CC` |

## Typography

- Font utama: Inter atau SF Pro.
- Heading: Medium / Semibold.
- Body: Regular.
- Ukuran font sederhana dan mudah dibaca.

# 3. Desktop Interface

Desktop merupakan halaman utama yang pertama kali dilihat pengguna setelah membuka NOVA OS.

Bog - YouTube

[youtube.com](<https://www.youtube.com/%40bogxd/posts?utm_source=chatgpt.com>)

### A. Top Menu Bar

Terletak di bagian paling atas layar.

Komponen:

- Logo NOVA.
- Menu File.
- Menu Edit.
- Menu View.
- Menu Window.
- Menu Help.
- Jam dan tanggal.
- Wi-Fi indicator (visual).
- Battery indicator (visual).
- Control Center.
- User profile.

Fungsi:

- Menampilkan menu sesuai aplikasi yang sedang aktif.
- Membuka pengaturan sistem.
- Menampilkan informasi waktu.
- Mengakses quick settings.

### B. Desktop Workspace

Area utama untuk menampilkan desktop.

Fitur:

- Wallpaper desktop.
- Shortcut aplikasi.
- Folder dan file.
- Context menu ketika klik kanan.
- Drag and drop icon.
- Double click untuk membuka aplikasi.
- Klik kanan untuk menampilkan pilihan tindakan.

### C. Dock

Zyed E.M (@zbem) on X

[twitter.com](<https://twitter.com/zbem?utm_source=chatgpt.com>)

Dock berada di tengah bagian bawah layar.

Aplikasi default:

- Finder.
- Browser.
- Terminal.
- Notes.
- Calculator.
- Calendar.
- Settings.
- Trash.

Interaksi:

- Hover menampilkan efek magnification.
- Klik membuka aplikasi.
- Indikator titik untuk aplikasi yang sedang aktif.
- Aplikasi dapat diminimize ke Dock.
- Animasi saat membuka dan menutup aplikasi.

# 4. Core Features

Berikut fitur utama yang harus tersedia.

## 4.1 Window Management

macOS Mojave vs macOS High Sierra | Macworld

[macworld.com](<https://www.macworld.com/article/667707/macos-mojave-vs-macos-high-sierra.html?utm_source=chatgpt.com>)

Sistem pengelolaan window seperti macOS.

Fitur:

- Open window.
- Close window.
- Minimize window.
- Maximize window.
- Resize window.
- Drag window.
- Multiple windows.
- Window stacking.
- Active window focus.
- Window snapping sederhana.

Setiap window memiliki:

- Header bar.
- Traffic light buttons (merah, kuning, hijau).
- Judul aplikasi.
- Konten aplikasi.
- Rounded corners.
- Shadow halus.

## 4.2 Finder (File Manager)

How do I get macOS Sonoma (14.0) to keep the same font size in the finder? - Ask Different

[apple.stackexchange.com](<https://apple.stackexchange.com/questions/465134/how-do-i-get-macos-sonoma-14-0-to-keep-the-same-font-size-in-the-finder?utm_source=chatgpt.com>)

Aplikasi untuk mengelola file virtual.

Fitur:

- Membuat folder.
- Membuat file.
- Rename file.
- Delete file.
- Copy dan paste.
- Drag and drop.
- Grid view.
- List view.
- Search files.
- Sidebar navigasi.

Folder default:

- Desktop.
- Documents.
- Downloads.
- Pictures.
- Applications.

Penyimpanan awal menggunakan IndexedDB atau localStorage sesuai jenis datanya.

## 4.3 Browser

Chrome Themes - Material Theme UI Documentation

[material-theme.com](<https://material-theme.com/docs/reference/chrome-themes/?utm_source=chatgpt.com>)

Browser internal di dalam NOVA OS.

Fitur:

- Address bar.
- Multiple tabs.
- Back dan forward.
- Refresh.
- Homepage.
- Bookmark.

Catatan: Browser internal dapat menggunakan iframe untuk situs yang mengizinkan embedding. Situs yang memblokir iframe harus dibuka di tab browser utama.

## 4.4 Terminal

disable rounded corners macos · Issue #2182 · wezterm/wezterm · GitHub

[github.com](<https://github.com/wezterm/wezterm/issues/2182?utm_source=chatgpt.com>)

Terminal virtual untuk memberikan pengalaman command line.

Command dasar:

- `help`
- `clear`
- `date`
- `time`
- `whoami`
- `ls`
- `pwd`
- `echo`
- `neofetch`

Terminal ini merupakan simulasi command line NOVA OS, bukan akses langsung ke shell komputer pengguna.

## 4.5 Notes

Write for Mac - Dark Theme by Tanmay on Dribbble

[dribbble.com](<https://dribbble.com/shots/1674503-Write-for-Mac-Dark-Theme?utm_source=chatgpt.com>)

Fitur:

- Membuat catatan.
- Mengedit catatan.
- Menghapus catatan.
- Auto save.
- Search notes.
- Daftar catatan di sidebar.

Data tersimpan secara lokal.

## 4.6 Calculator

Here's which features Apple changed ahead of WWDC 2024

[appleinsider.com](<https://appleinsider.com/articles/24/06/19/heres-which-features-apple-changed-ahead-of-their-wwdc-2024-debut?utm_source=chatgpt.com>)

Fitur:

- Basic arithmetic.
- Addition.
- Subtraction.
- Multiplication.
- Division.
- Percentage.
- Clear dan delete.

## 4.7 Calendar

Anticipatory Design in User Experience | Ramotion Agency

[ramotion.com](<https://www.ramotion.com/blog/anticipatory-design/?utm_source=chatgpt.com>)

Fitur:

- Tampilan kalender bulanan.
- Navigasi bulan.
- Membuat event.
- Menghapus event.
- Menampilkan tanggal saat ini.

## 4.8 System Settings

How to make Dark Mode on a Mac

[setapp.com](<https://setapp.com/how-to/how-to-make-mac-dark-mode?utm_source=chatgpt.com>)

Pengaturan sistem virtual.

Kategori:

- Appearance.
- Wallpaper.
- Dock.
- Desktop.
- Sound.
- Date & Time.
- About NOVA OS.

Fitur:

- Mengganti wallpaper.
- Mengubah accent color.
- Mengatur ukuran Dock.
- Mengatur posisi Dock.
- Mengatur tampilan desktop.
- Mengubah nama perangkat virtual.

# 5. User Experience & Interaction

Pengalaman pengguna harus terasa seperti menggunakan desktop OS sungguhan.

| Interaksi | Perilaku |
| --- | --- |
| Single click | Memilih aplikasi atau file |
| Double click | Membuka aplikasi atau file |
| Right click | Membuka context menu |
| Drag window | Memindahkan window |
| Click red button | Menutup window |
| Click yellow button | Minimize window |
| Click green button | Maximize window |
| Hover dock | Efek magnification |
| ESC | Menutup dialog atau menu |
| Ctrl/Cmd + Space | Membuka Spotlight |

## Spotlight Search

Raycast vs Spotlight: The Ultimate Launcher Showdown | by Nihal Shah | Mac O’Clock | Medium

[medium.com](<https://medium.com/macoclock/raycast-vs-spotlight-the-ultimate-launcher-showdown-61b77b50097d?utm_source=chatgpt.com>)

Fitur pencarian cepat yang muncul ketika pengguna menekan `Ctrl/Cmd + Space`.

Dapat digunakan untuk:

- Mencari aplikasi.
- Mencari file.
- Membuka Settings.
- Menjalankan command sederhana.

# 6. Technical Requirements

## Recommended Tech Stack

| Teknologi | Kegunaan |
| --- | --- |
| Next.js | Framework utama |
| React | UI Components |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| Framer Motion | Animations |
| Lucide React | Icons |
| IndexedDB | Local file storage |
| localStorage | User preferences |

## Architecture

text

```text
NOVA OS
│
├── Desktop Environment
│   ├── Menu Bar
│   ├── Desktop Workspace
│   ├── Dock
│   └── Context Menu
│
├── Window Manager
│   ├── Window Controller
│   ├── Drag & Resize
│   ├── Minimize / Maximize
│   └── Focus Manager
│
├── Applications
│   ├── Finder
│   ├── Browser
│   ├── Terminal
│   ├── Notes
│   ├── Calculator
│   ├── Calendar
│   └── Settings
│
├── System Core
│   ├── App Registry
│   ├── File System
│   ├── Event Manager
│   └── Preferences
│
└── Storage
    ├── IndexedDB
    └── LocalStorage
```

## Important Technical Notes

NOVA OS bukan kernel operating system sungguhan. Ini adalah simulasi desktop environment yang berjalan di atas browser.

Semua aplikasi berjalan di dalam lingkungan web. Data disimpan secara lokal di browser pengguna.

# 7. Main Pages & Screens

| Screen | Deskripsi |
| --- | --- |
| Boot Screen | Animasi loading saat OS dibuka |
| Desktop | Tampilan utama OS |
| Finder | File manager |
| Browser | Browser virtual |
| Terminal | Command line virtual |
| Notes | Aplikasi catatan |
| Calculator | Kalkulator |
| Calendar | Kalender |
| Settings | Pengaturan sistem |
| Spotlight | Pencarian universal |

# 8. MVP Development Scope

Agar pengembangan tidak terlalu kompleks, berikut prioritas pengerjaan.

Phase 1 — Core Desktop

Prioritas tinggi

- Boot screen
- Desktop interface
- Menu bar
- Dock
- Window manager
- Open / close / minimize / maximize
  Phase 2 — Core Applications
  Prioritas tinggi
- Finder
- Notes
- Calculator
- Terminal
- Settings
  Phase 3 — System Experience
  Prioritas menengah
- Spotlight
- Context menu
- Wallpaper customization
- Drag and drop
- Keyboard shortcuts
- Persistent storage
  Phase 4 — Advanced Features
  Pengembangan lanjutan
- Multiple desktop spaces
- User accounts
- Cloud synchronization
- App installation simulation
- Advanced file management

# 9. Acceptance Criteria

Produk dianggap memenuhi MVP jika:

- [ ]Desktop dapat dibuka melalui browser.
- [ ]Tampilan dark mode konsisten.
- [ ]Dock dapat membuka aplikasi.
- [ ]Aplikasi dapat berjalan dalam window terpisah.
- [ ]Window dapat dipindahkan dan diubah ukurannya.
- [ ]Window dapat diminimize, maximize, dan close.
- [ ]Finder dapat mengelola file virtual.
- [ ]Notes dapat menyimpan catatan.
- [ ]Terminal dapat menjalankan command simulasi.
- [ ]Settings dapat mengubah tampilan desktop.
- [ ]Data penting tetap tersimpan setelah browser direfresh.
- [ ]Tampilan responsif dan tidak mengalami layout overflow.

# 10. Product Vision

Docky: Pin, group, and remove apps easily from your dock | Product Hunt

[producthunt.com](<https://www.producthunt.com/products/docky-the-dock-rebuit-for-focus?utm_source=chatgpt.com>)

NOVA OS harus memberikan kesan:

- Minimalist.
- Premium.
- Modern.
- Smooth.
- Lightweight.
- Intuitive.

Prinsip utama desain:

"Less UI, More Experience."

Pengguna tidak perlu melihat banyak tombol atau menu yang tidak diperlukan. Fokus utama adalah desktop yang bersih, aplikasi yang mudah diakses, dan interaksi yang terasa natural.

# 11. Rekomendasi Implementasi

Menurut saya, ada tiga hal yang paling penting untuk keberhasilan proyek ini:

1. Window Manager menjadi fondasi utama. Jangan membuat setiap aplikasi berjalan sebagai halaman terpisah. Semua aplikasi harus berjalan dalam sistem window yang sama.
2. Desktop harus terasa hidup. Tambahkan animasi membuka aplikasi, efek Dock, transisi window, dan Spotlight.
3. Utamakan konsistensi desain. Semua aplikasi harus menggunakan komponen UI, warna, radius, dan typography yang sama.

Saran: Mulai dengan MVP yang berisi Desktop, Dock, Window Manager, Finder, Notes, Terminal, dan Settings. Setelah fondasinya stabil, baru tambahkan aplikasi lain.

Langkah berikutnya yang paling tepat adalah membuat desain UI lengkap NOVA OS dalam bentuk prototype, kemudian mengembangkan komponen Desktop dan Window Manager sebagai fondasi seluruh sistem.