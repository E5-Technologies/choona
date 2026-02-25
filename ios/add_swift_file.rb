require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
group = project.main_group.find_subpath(File.join('Choona'), true)
file = group.new_reference('Empty.swift')
project.targets.each do |target|
  target.add_file_references([file])
  target.build_configurations.each do |config|
    config.build_settings['SWIFT_VERSION'] = '5.0'
    config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'
  end
end
project.save
