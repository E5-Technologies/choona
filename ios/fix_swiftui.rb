require 'xcodeproj'

project = Xcodeproj::Project.open('Choona.xcodeproj')

# Add SwiftUI.framework to both Choona and ChoonaDev targets
targets_to_fix = ['Choona', 'ChoonaDev']

project.targets.each do |target|
  next unless targets_to_fix.include?(target.name)
  puts "Processing target: #{target.name}"

  # Check if SwiftUI.framework is already linked
  existing = target.frameworks_build_phase.files.map { |f| f.display_name }
  puts "  Existing frameworks: #{existing.join(', ')}"

  if existing.include?('SwiftUI.framework')
    puts "  SwiftUI.framework already linked, skipping."
    next
  end

  # Find or create SwiftUI.framework reference
  swiftui_ref = project.frameworks_group.files.find { |f| f.path == 'System/Library/Frameworks/SwiftUI.framework' }
  unless swiftui_ref
    swiftui_ref = project.frameworks_group.new_file('System/Library/Frameworks/SwiftUI.framework')
    swiftui_ref.source_tree = 'SDKROOT'
    puts "  Added SwiftUI.framework file reference."
  end

  # Add to frameworks build phase
  build_file = target.frameworks_build_phase.add_file_reference(swiftui_ref)
  # Mark as weak/optional so it doesn't break older OS versions
  build_file.settings = { 'ATTRIBUTES' => ['Weak'] }
  puts "  ✅ Linked SwiftUI.framework (weak) to #{target.name}"

  # Also set ASSETCATALOG settings to suppress SwiftUI code generation
  target.build_configurations.each do |config|
    config.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS'] = 'NO'
    config.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOLS'] = 'NO'
  end
  puts "  ✅ Disabled SwiftUI asset symbol generation."
end

project.save
puts "\n✅ Done! SwiftUI.framework linked and asset symbols disabled."
