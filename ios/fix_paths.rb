require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
project.targets.each do |target|
  target.build_configurations.each do |config|
    
    # 1. Clean OTHER_LDFLAGS
    ldflags = config.build_settings['OTHER_LDFLAGS'] || ['$(inherited)']
    ldflags = [ldflags] if ldflags.is_a?(String)
    ldflags = ldflags.reject { |flag| flag.include?('TOOLCHAIN_DIR') || flag.include?('swift-5.0') }
    config.build_settings['OTHER_LDFLAGS'] = ldflags
    
    # 2. Clean LIBRARY_SEARCH_PATHS
    search_paths = config.build_settings['LIBRARY_SEARCH_PATHS'] || ['$(inherited)']
    search_paths = [search_paths] if search_paths.is_a?(String)
    search_paths = search_paths.reject { |flag| flag.include?('TOOLCHAIN_DIR') || flag.include?('swift-5.0') }
    config.build_settings['LIBRARY_SEARCH_PATHS'] = search_paths

  end
end
project.save

puts "Check Pods project"
project_path = 'Pods/Pods.xcodeproj'
if File.exist?(project_path)
  project = Xcodeproj::Project.open(project_path)
  project.targets.each do |target|
    target.build_configurations.each do |config|
      # 1. Clean OTHER_LDFLAGS
      ldflags = config.build_settings['OTHER_LDFLAGS'] || ['$(inherited)']
      ldflags = [ldflags] if ldflags.is_a?(String)
      ldflags = ldflags.reject { |flag| flag.include?('TOOLCHAIN_DIR') || flag.include?('swift-5.0') }
      config.build_settings['OTHER_LDFLAGS'] = ldflags
      
      # 2. Clean LIBRARY_SEARCH_PATHS
      search_paths = config.build_settings['LIBRARY_SEARCH_PATHS'] || ['$(inherited)']
      search_paths = [search_paths] if search_paths.is_a?(String)
      search_paths = search_paths.reject { |flag| flag.include?('TOOLCHAIN_DIR') || flag.include?('swift-5.0') }
      config.build_settings['LIBRARY_SEARCH_PATHS'] = search_paths
    end
  end
  project.save
end
puts "Removed TOOLCHAIN_DIR from ALL search paths and flags."
