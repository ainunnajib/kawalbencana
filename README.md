# KawalBencana

Platform untuk mengawal pemulihan ekonomi jangka panjang pasca bencana banjir dan longsor Aceh-Sumatera 2024-2025.

## Tech Stack

- **Framework:** Next.js 15.0.4 with App Router
- **Language:** TypeScript 5+ (strict mode)
- **Styling:** Tailwind CSS 3.4+ with shadcn/ui
- **State Management:** TanStack Query (React Query) + Zustand
- **Database:** Supabase (PostgreSQL)
- **Maps:** Leaflet + React Leaflet
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kawalbencana.git
cd kawalbencana
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kawalbencana/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   ├── providers.tsx # React Query provider
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── databases/   # Infrastructure data components
│   │   ├── ai/          # AI-related components
│   │   └── helper/      # Utility components
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── lib/             # Library configurations
├── public/              # Static files
├── PRD.md              # Product Requirements Document
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Features (Planned)

1. **Recovery Point Mapping** - Interactive map showing recovery points
2. **Photo Timeline Tracking** - Visual documentation of recovery progress
3. **Needs & Assistance Matching** - Connect people who need help with helpers
4. **Progress Dashboard** - Analytics and metrics for recovery monitoring
5. **Transparency Portal** - Public ledger for all assistance transactions
6. **Community Engagement** - Forums and discussions
7. **Notifications** - Keep users engaged long-term

## Development Guidelines

- Follow strict TypeScript practices
- Use shadcn/ui patterns for UI components
- Wrap external API calls in React Query hooks
- Use the established path aliases (`@/components`, `@/utils`, etc.)
- Components should be organized by functionality

## Database Setup

See [PRD.md](./PRD.md) for the complete database schema. You'll need to create tables in Supabase for:

- users
- recovery_points
- photo_updates
- needs
- assistance_offers
- matches
- transactions
- comments
- notifications

## Contributing

This is a humanitarian project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

TBD

## Contact

For questions or support, please contact [to be added]

---

**Mari kita kawal pemulihan Aceh dan Sumatera bersama-sama.**
