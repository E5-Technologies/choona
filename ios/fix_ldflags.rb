require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
project.targets.each do |target|
  target.build_configurations.each do |config|
    ldflags = config.build_settings['OTHER_LDFLAGS'] || ['$(inherited)']
    ldflags = [ldflags] if ldflags.is_a?(String)
    
    # We remove the TOOLCHAIN_DIR paths as they lead to x86_64 conflicts!
    # Remove any swift or TOOLCHAIN paths
    ldflags = ldflags.reject { |flag| flag.include?('TOOLCHAIN_DIR') }

    # Required for Swift 5 / Xcode 16 linking Native Symbols (from SDK!)
    ['-L"$(SDKROOT)/usr/lib/swift"',
     '-Wl,-rpath,"/usr/lib/swift"',
     '-Wl,-rpath,"$(SDKROOT)/usr/lib/swift"',
     '-lswiftCore',
     '-lswiftDarwin',
     '-lswiftDispatch',
     '-lswiftCoreFoundation',
     '-lswiftObjectiveC',
     '-lswiftFoundation',
     '-lswiftCoreGraphics'].each do |flag|
       ldflags << flag unless ldflags.include?(flag)
     end
    
    config.build_settings['OTHER_LDFLAGS'] = ldflags
  end
end
project.save
puts "Removed TOOLCHAIN_DIR and fixed Swift link order"
