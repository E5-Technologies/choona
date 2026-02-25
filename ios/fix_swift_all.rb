require 'xcodeproj'
require 'set'

puts "Starting complete fix for Xcode 26 / iOS 26 SDK..."

# ════════════════════════════════════════════════════════════════════
# MAIN PROJECT FIX
# ════════════════════════════════════════════════════════════════════
project = Xcodeproj::Project.open('Choona.xcodeproj')

project.targets.each do |target|
  next unless ['Choona', 'ChoonaDev'].include?(target.name)
  puts "\nFixing main target: #{target.name}"

  target.build_configurations.each do |cfg|
    # ── Swift stdlib location (Xcode 26 SDK has TBDs here) ──────────────
    paths = cfg.build_settings['LIBRARY_SEARCH_PATHS'] || ['$(inherited)']
    paths = [paths] if paths.is_a?(String)
    paths.reject! { |p| p.to_s.include?('TOOLCHAIN_DIR') || p.to_s.include?('swift-5.0') }
    paths = [
      '/usr/lib/swift',
      '"$(SDKROOT)/usr/lib/swift"',
      '"$(PLATFORM_DIR)/Developer/SDKs/$(SDK_NAME).sdk/usr/lib/swift"'
    ] + paths
    cfg.build_settings['LIBRARY_SEARCH_PATHS'] = paths.uniq

    # ── Runpath ─────────────────────────────────────────────────────────
    cfg.build_settings['LD_RUNPATH_SEARCH_PATHS'] = '/usr/lib/swift $(inherited) @executable_path/Frameworks'

    # ── Explicit Swift stdlib linking (Xcode 26 TBDs) ───────────────────
    base_ldflags = ['$(inherited)']
    existing = cfg.build_settings['OTHER_LDFLAGS'] || []
    existing = [existing] if existing.is_a?(String)
    existing.each do |f|
      next if f.to_s.include?('TOOLCHAIN_DIR')
      next if f.to_s.include?('swift-5.0')
      next if f.to_s.start_with?('-lswift')
      next if (f.to_s.start_with?('-L') && f.to_s.include?('swift'))
      next if f.to_s.include?('-rpath')
      base_ldflags << f unless base_ldflags.include?(f)
    end
    # Add explicit Swift system libs
    %w[
      -lswiftCore
      -lswiftObjectiveC
      -lswiftFoundation
      -lswiftDarwin
      -lswiftDispatch
      -lswiftCoreFoundation
      -lswiftCoreGraphics
      -lswiftCoreImage
      -lswiftMetal
      -lswiftQuartzCore
      -lswiftUIKit
      -lswiftos
      -lswiftCompatibility50
      -lswiftCompatibility51
      -lswiftCompatibility56
      -lswiftCompatibilityConcurrency
    ].each { |f| base_ldflags << f }

    cfg.build_settings['OTHER_LDFLAGS'] = base_ldflags.uniq

    # ── Embed Swift stdlib into the main app bundle ─────────────────────
    cfg.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'

    # ── Disable SwiftUI asset symbol generation (Xcode 15+/26 feature) ──
    cfg.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS'] = 'NO'
    cfg.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOLS'] = 'NO'

    # ── Disable potential problematic features in Xcode 26 ─────────────
    cfg.build_settings['ENABLE_DEBUG_DYLIB'] = 'NO'
    cfg.build_settings['EAGER_LINKING'] = 'NO'

    # ── Deployment target ────────────────────────────────────────────────
    cfg.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
  end

  # ── Ensure SwiftUI.framework is weakly linked ────────────────────────
  unless target.frameworks_build_phase.files.any? { |f| f.display_name == 'SwiftUI.framework' }
    ref = project.frameworks_group.files.find { |f| f.path.to_s.include?('SwiftUI.framework') }
    unless ref
      ref = project.frameworks_group.new_file('System/Library/Frameworks/SwiftUI.framework')
      ref.source_tree = 'SDKROOT'
    end
    bf = target.frameworks_build_phase.add_file_reference(ref)
    bf.settings = { 'ATTRIBUTES' => ['Weak'] }
    puts "  ✅ SwiftUI.framework weakly linked"
  end

  puts "  ✅ Build settings applied"
end

project.save
puts "\n✅ Main project saved."

# ════════════════════════════════════════════════════════════════════
# PODS PROJECT FIX
# ════════════════════════════════════════════════════════════════════
pods_project = Xcodeproj::Project.open('Pods/Pods.xcodeproj')

pods_project.targets.each do |target|
  target.build_configurations.each do |cfg|
    cfg.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    cfg.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'NO'

    # Disable SwiftUI asset symbols for pods too
    cfg.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS'] = 'NO'
    cfg.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOLS'] = 'NO'

    # Suppress pod compilation warnings-as-errors
    cflags = cfg.build_settings['OTHER_CFLAGS'] || '$(inherited)'
    cflags = cflags.is_a?(Array) ? cflags : [cflags]
    cflags += ['-Wno-error', '-Wno-strict-prototypes', '-Wno-deprecated-declarations']
    cfg.build_settings['OTHER_CFLAGS'] = cflags.uniq

    # Pods: keep LIBRARY_SEARCH_PATHS simple
    paths = cfg.build_settings['LIBRARY_SEARCH_PATHS'] || ['$(inherited)']
    paths = [paths] if paths.is_a?(String)
    paths.reject! { |p| p.to_s.include?('TOOLCHAIN_DIR') || p.to_s.include?('swift-5.0') }
    paths = [
      '/usr/lib/swift',
      '"$(SDKROOT)/usr/lib/swift"',
      '"$(PLATFORM_DIR)/Developer/SDKs/$(SDK_NAME).sdk/usr/lib/swift"'
    ] + paths
    cfg.build_settings['LIBRARY_SEARCH_PATHS'] = paths.uniq

    # Clean up OTHER_LDFLAGS for pods
    ldflags = cfg.build_settings['OTHER_LDFLAGS'] || ['$(inherited)']
    ldflags = [ldflags] if ldflags.is_a?(String)
    ldflags.reject! { |f|
      s = f.to_s
      s.include?('TOOLCHAIN_DIR') || s.include?('swift-5.0') ||
      (s.start_with?('-lswift')) ||
      (s.start_with?('-L') && s.include?('swift'))
    }
    cfg.build_settings['OTHER_LDFLAGS'] = ldflags.uniq
  end
end

pods_project.save
puts "✅ Pods project saved."

puts "\n🎉 All done! Now run: yarn ios"
