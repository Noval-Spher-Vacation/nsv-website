## Novel Sphere Vacations

This app was created using https://getmocha.com.
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).

To run the devserver:
```
npm install
npm run dev
```

### Supabase + Cloudflare Pages configuration

Required environment variables (Vite):
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Supabase dashboard Auth settings:
- Site URL: `https://nsv-website.pages.dev`
- Additional Redirect URLs: `https://nsv-website.pages.dev/*`
