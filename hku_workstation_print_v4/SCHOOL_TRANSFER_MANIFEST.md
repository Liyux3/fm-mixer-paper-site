# School Transfer Manifest

For tomorrow, copy the minimal zip first. Keep the full zip nearby only as audit backup.

| File | Purpose | Size bytes | SHA256 |
|---|---|---:|---|
| `printable_school_print_v4_minimal.zip` | Preferred minimal school-print zip: only required STLs, one short note, color CSV, checksums. | 7118318 | `2d30e84d4a4dc055579ce24b472ceaaac82d37f7c3539344398b97b0e920077b` |
| `printable_school_print_v4_minimal.zip.sha256` | SHA256 check file for the minimal school-print zip. | 104 | `df3e818e4a86b7cb3bcb835dd4ccb16aa0a74a16c6cf5f60708ad9ea828eb932` |
| `printable_release_v4.zip` | Full audited V4 release with docs, previews, validator and local Bambu smoke evidence. | 18310087 | `1682fe90ab5be0d6b8bc5fb8500578cd00e0c8ec9650237f0e5372538b5d8566` |
| `printable_release_v4.zip.sha256` | SHA256 check file for the full audited V4 release zip. | 91 | `e3e82a687d527f4e5e93d44d2300054f0bef5233a50634a97d043fe9f23ed2fe` |
| `A_bottom_left_H_school_smoke_kit.zip` | First-tile A smoke kit, useful if the operator wants a tiny GUI import test first. | 897085 | `d22b708a064c7db39f311a64b483e9ea70740e19de459e715c281280ba33e7ab` |
| `A_bottom_left_H_school_smoke_kit.zip.sha256` | SHA256 check file for the first-tile smoke kit zip. | 103 | `a17d95e7afb193826d02fd755dfe4d5d07bfce5909ba370d135da2d7d09f33c8` |

Suggested check commands from this folder:

```sh
shasum -a 256 -c printable_school_print_v4_minimal.zip.sha256
shasum -a 256 -c printable_release_v4.zip.sha256
shasum -a 256 -c A_bottom_left_H_school_smoke_kit.zip.sha256
unzip -t printable_school_print_v4_minimal.zip
```

Open `printable_school_print_v4_minimal.zip` for the actual school print handoff.

Use `A_bottom_left_H_school_smoke_kit.zip` only as an optional tiny import smoke test.
