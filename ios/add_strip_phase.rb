require 'xcodeproj'

project = Xcodeproj::Project.open('Choona.xcodeproj')

STRIP_SCRIPT = <<~'SHELL'
  # Strip SwiftUI extensions from GeneratedAssetSymbols.swift
  # This runs after asset catalog compilation but before Swift compilation.
  FILE="$DERIVED_FILE_DIR/GeneratedAssetSymbols.swift"
  if [ -f "$FILE" ]; then
    # Remove the SwiftUI import and SwiftUI.Color/SwiftUI.Image extensions
    # Using perl for reliable multi-line removal (sed is unreliable cross-platform)
    perl -i -0pe 's/#if canImport\(SwiftUI\).*?#endif\n?//gs' "$FILE"
    echo "Stripped SwiftUI from GeneratedAssetSymbols.swift"
  fi
SHELL

['Choona', 'ChoonaDev'].each do |name|
  target = project.targets.find { |t| t.name == name }
  next unless target

  # Remove existing strip phases if any (to avoid duplicates)
  target.shell_script_build_phases.select { |p| p.name == '[Fix] Strip SwiftUI from GeneratedAssetSymbols' }.each(&:remove_from_project)

  # Add new run script phase right before compile sources
  phase = project.new(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
  phase.name = '[Fix] Strip SwiftUI from GeneratedAssetSymbols'
  phase.shell_path = '/bin/sh'
  phase.shell_script = STRIP_SCRIPT
  phase.run_only_for_deployment_postprocessing = '0'

  # Insert it just before the Sources build phase
  sources_index = target.build_phases.index(target.source_build_phase) || 0
  target.build_phases.insert(sources_index, phase)

  puts "✅ Added SwiftUI strip script to #{name}"
end

project.save
puts "✅ Project saved."
