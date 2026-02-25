require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
project.targets.each do |target|
  target.build_configurations.each do |config|
    paths = config.build_settings['LIBRARY_SEARCH_PATHS'] || ['$(inherited)']
    paths = [paths] if paths.is_a?(String)
    paths << '"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)"'
    paths << '"$(TOOLCHAIN_DIR)/usr/lib/swift-5.0/$(PLATFORM_NAME)"'
    config.build_settings['LIBRARY_SEARCH_PATHS'] = paths.uniq
    config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'
  end
end
project.save
