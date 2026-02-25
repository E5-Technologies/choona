require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)

project.targets.each do |target|
  target.build_configurations.each do |config|
    config.build_settings.delete('LIBRARY_SEARCH_PATHS')
    config.build_settings.delete('OTHER_LDFLAGS')
    config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'
  end
end

project.save
puts "Cleaned LDFLAGS and LIBRARY_SEARCH_PATHS from project.pbxproj"
