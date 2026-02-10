# TOON Format Reference for Figma Data

## Complete Element Type Mapping

### Layout Elements

| Figma Type | TOON Short | Description |
|------------|------------|-------------|
| `frame` | `fr` | Container frame |
| `group` | `grp` | Grouped elements |
| `section` | `sec` | Section container |
| `component` | `comp` | Component definition |
| `component-set` | `cset` | Component variants container |
| `instance` | `inst` | Component instance |

### Shape Elements

| Figma Type | TOON Short | Description |
|------------|------------|-------------|
| `rectangle` | `rect` | Rectangle shape |
| `rounded-rectangle` | `rrect` | Rounded rectangle |
| `ellipse` | `ell` | Ellipse/circle |
| `line` | `ln` | Line element |
| `polygon` | `poly` | Polygon shape |
| `star` | `star` | Star shape |
| `vector` | `vec` | Vector path |

### Content Elements

| Figma Type | TOON Short | Description |
|------------|------------|-------------|
| `text` | `txt` | Text element |
| `symbol` | `sym` | Symbol/icon |
| `image` | `img` | Bitmap image |
| `video` | `vid` | Video element |

### Special Elements

| Figma Type | TOON Short | Description |
|------------|------------|-------------|
| `boolean-operation` | `bool` | Boolean path operation |
| `slice` | `slc` | Export slice |
| `connector` | `conn` | FigJam connector |
| `stamp` | `stmp` | FigJam stamp |
| `sticky` | `stky` | FigJam sticky note |

## Attribute Compression Dictionary

### Geometry
```
x → x
y → y
width → w
height → h
rotation → rot
cornerRadius → cr
topLeftRadius → tlr
topRightRadius → trr
bottomLeftRadius → blr
bottomRightRadius → brr
```

### Appearance
```
opacity → op
visible → vis
hidden → hid
locked → lck
blendMode → blend
```

### Fill & Stroke
```
fill → fill
fillColor → fill
fillOpacity → fop
stroke → stroke
strokeColor → stroke
strokeWidth → sw
strokeAlign → sa
strokeCap → cap
strokeJoin → join
dashPattern → dash
```

### Effects
```
boxShadow → shd
dropShadow → dshd
innerShadow → ishd
blur → blur
backgroundBlur → bblur
```

### Text
```
fontSize → fs
fontFamily → ff
fontWeight → fw
fontStyle → fst
lineHeight → lh
letterSpacing → ls
textAlign → ta
textAlignVertical → tav
textDecoration → td
textTransform → tt
```

### Layout
```
layoutMode → lm
layoutAlign → la
primaryAxisAlign → paa
counterAxisAlign → caa
padding → pad
paddingTop → pt
paddingRight → pr
paddingBottom → pb
paddingLeft → pl
gap → gap
itemSpacing → isp
```

### Constraints
```
constraintHorizontal → ch
constraintVertical → cv
```

## Compact Value Formats

### Colors

```
# Full hex (6 chars)
#FF5500 → FF5500

# Short hex (3 chars expanded)
#F50 → FF5500

# With opacity (0-100%)
rgba(255,85,0,0.5) → FF5500@50

# Named colors (optional shorthand)
black → 000
white → FFF
transparent → T

# Gradients
linear-gradient(90deg, #FF0000, #0000FF) → lg:90,FF0000,0000FF
radial-gradient(#FF0000, #0000FF) → rg:FF0000,0000FF
```

### Transforms

```
# Translation
translate(10, 20) → t:10,20

# Scale
scale(2, 1.5) → s:2,1.5

# Rotation (degrees)
rotate(45deg) → r:45

# Combined matrix
matrix(a,b,c,d,e,f) → m:a,b,c,d,e,f
```

### Bounds Formats

```
# Position + Size (default)
x,y,w,h → 10,20,100,50

# Position only (when size inherent)
x,y → 10,20

# Size only (for definitions)
w,h → 100,50

# Center + Size (alternative)
cx,cy,w,h → c:55,45,100,50
```

## Tabular Array Optimization

### Uniform Children Pattern

When all children share the same structure, use tabular format:

```toon
# Declaration: array[count]{field1,field2,...}:
children[5]{type,id,name,x,y,w,h}:
 sym,1:1,home,0,0,24,24
 sym,1:2,search,30,0,24,24
 sym,1:3,cart,60,0,24,24
 sym,1:4,profile,90,0,24,24
 sym,1:5,menu,120,0,24,24
```

### Mixed Children Pattern

When children have different structures, use nested format:

```toon
children:
  - type: fr
    id: 1:1
    name: header
    bounds: 0,0,400,60
    children[2]{type,id,name,x,y,w,h}:
     txt,1:2,title,10,20,200,24
     sym,1:3,logo,360,10,30,30

  - type: txt
    id: 1:4
    name: description
    bounds: 0,70,400,100
    content: Lorem ipsum...
```

### Grouping by Type

For clarity, group similar elements:

```toon
frame:
  id: 1:1
  name: IconSet

  # All icons
  icons[10]{id,name,x,y}:
   1:2,home,0,0
   1:3,search,30,0
   ...

  # All labels
  labels[10]{id,name,x,y,w}:
   2:1,Home,0,30,30
   2:2,Search,30,30,40
   ...
```

## Dark Mode Handling

### Paired Variants

When icons come in light/dark pairs, encode together:

```toon
# Option 1: Variant suffix
icons[4]{id,name,mode,x,y,w,h}:
 1:1,home,light,0,0,24,24
 1:2,home,dark,30,0,24,24
 1:3,search,light,60,0,24,24
 1:4,search,dark,90,0,24,24

# Option 2: Paired structure
iconPairs[2]{name,lightId,darkId,x,y,w,h}:
 home,1:1,1:2,0,0,24,24
 search,1:3,1:4,30,0,24,24
```

### Color Variants

```toon
colors:
  primary:
    light: 007AFF
    dark: 0A84FF
  background:
    light: FFFFFF
    dark: 000000
  text:
    light: 000000@87
    dark: FFFFFF@87
```

## Path Data Compression

For vector paths, use abbreviated SVG path syntax:

```toon
# SVG path commands stay similar but compact
# M=moveto, L=lineto, C=curveto, Z=close
path: M0,0L24,12L0,24Z

# Multiple paths
paths[2]:
 M0,0L10,10L0,20Z
 M5,5L15,5L15,15L5,15Z
```

## Special Annotations

### Asset References

```toon
# Image reference
img:
  id: 1:1
  name: hero
  bounds: 0,0,400,200
  src: assets/hero.png
  # or Figma asset URL
  src: figma://image/abc123

# Component reference
inst:
  id: 1:2
  name: Button
  bounds: 100,100,120,40
  ref: comp/Button
  overrides:
    label: Submit
    variant: primary
```

### Metadata

```toon
# File metadata header
meta:
  file: Design System
  page: Icons
  exported: 2024-01-15T10:30:00Z
  version: 1.2.3
  author: designer@example.com
```

## Escaping Rules

```
# Strings with special characters
name: "Button, Primary"  # Comma in value
name: "Line\nBreak"      # Newline
name: "Quote \"here\""   # Quote

# In tabular arrays, escape commas
children[1]{id,name,desc}:
 1:1,"My, Button","A button, with comma"
```

## Validation Checklist

Before finalizing TOON output:

1. [ ] All IDs are preserved (Figma node IDs are important)
2. [ ] Bounds are accurate (x,y,w,h)
3. [ ] Hidden elements marked or filtered
4. [ ] Dark mode variants properly grouped
5. [ ] Special characters escaped
6. [ ] Array counts match actual rows
7. [ ] Nested structure depth is reasonable

## Back-Conversion Notes

TOON can be converted back to JSON/XML for:
- Design tools integration
- Code generation
- Validation against original

Key considerations:
- Expand short type names to full
- Expand attribute shortcuts
- Parse bounds back to x,y,width,height
- Restore color format with #
