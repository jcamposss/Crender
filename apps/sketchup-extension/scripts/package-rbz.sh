#!/bin/sh
# Packages the extension as an .rbz (a zip with the loader and its folder at the root),
# the format accepted by SketchUp's Extension Manager.
set -eu

extension_root="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$extension_root/src"
output_dir="$extension_root/dist"

if [ ! -f "$source_dir/crender_ia/ui/index.html" ]; then
  echo "Plugin UI not built: run 'pnpm build' from the repository root." >&2
  exit 1
fi

version="$(sed -n "s/.*VERSION = '\(.*\)'.*/\1/p" "$source_dir/crender_ia/version.rb")"
package="$output_dir/crender_ia-$version.rbz"

mkdir -p "$output_dir"
rm -f "$output_dir"/*.rbz
(cd "$source_dir" && zip -qr "$package" crender_ia.rb crender_ia)
echo "Packaged $package"
