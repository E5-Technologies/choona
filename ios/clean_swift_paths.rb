require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
project.targets.each do |target|
  target.build_configurations.each do |config|
    ['LIBRARY_SEARCH_PATHS', 'OTHER_LDFLAGS'].each do |setting|
      val = config.build_settings[setting]
      if val.is_a?(Array)
        config.build_settings[setting] = val.reject { |v| v.include?('swift') }
      elsif val.is_a?(String)
        config.build_settings[setting] = val if !val.include?('swift')
      end
    end
    # Also ensure standard library embed setting is ON
    config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'
  end
end
project.save
puts "Cleaned overriding swift configs"
