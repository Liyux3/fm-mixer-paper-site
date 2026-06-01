# HKU Workstation V4 School Print Package

This folder is the 2026-06-01 school-print handoff for the modular HKU workstation.

Download this file first:

```text
printable_school_print_v4_minimal.zip
```

SHA256:

```text
2d30e84d4a4dc055579ce24b472ceaaac82d37f7c3539344398b97b0e920077b
```

The zip contains only the actual print files: 22 STL files, one short bilingual instruction file, one color assignment CSV, and checksums.

Quick Bambu Studio rule:

1. Use Add model / Import model for STL files.
2. Start with `A_bottom_left_H_base.stl`, `A_bottom_left_H_floor_color.stl`, and `A_bottom_left_H_platform_gray.stl`.
3. Import those three together as one object with multiple parts.
4. Assign `base` to graphite, `floor_color` to plum, and `platform_gray` to light gray.
5. Slice, open Preview, switch display to Filament, and check Z 2..4 mm color layers.
6. Move the prime tower away from the model before printing.

中文短版：

1. 下载 `printable_school_print_v4_minimal.zip`。
2. 在 Bambu Studio 里用 Add model / Import model 导入 STL。
3. 先试 A 块，三个 `A_bottom_left_H_*.stl` 一起导入，选择 one object with multiple parts。
4. `base` 黑灰，`floor_color` 梅紫，`platform_gray` 浅灰。
5. 切片后看 Preview > Filament，检查 Z=2..4 mm 分层。
6. 换色塔拖到空角落，别贴着模型。

Validation summary:

```text
problem_count = 0
stl_count = 22
all_stl_watertight = true
all_stls_match_release = true
largest_part_extent_mm = 250.0
largest_stl_mb = 4.167
```
