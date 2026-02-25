require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
target = project.targets.find { |t| t.name == 'ChoonaDev' }
target.build_configurations.each do |config|
  puts "Configuration: #{config.name}"
  puts "LIBRARY_SEARCH_PATHS: #{config.build_settings['LIBRARY_SEARCH_PATHS']}"
  puts "OTHER_LDFLAGS: #{config.build_settings['OTHER_LDFLAGS']}"
  puts "LD_RUNPATH_SEARCH_PATHS: #{config.build_settings['LD_RUNPATH_SEARCH_PATHS']}"
  puts "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES: #{config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES']}"
  puts "---"
end
