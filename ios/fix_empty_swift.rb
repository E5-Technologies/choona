require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
group = project.main_group.find_subpath(File.join('Choona'), true)

file = group.files.find { |f| f.path == 'Empty.swift' }
unless file
  file = group.new_reference('Empty.swift')
end

project.targets.each do |target|
  if target.respond_to?(:source_build_phase)
    unless target.source_build_phase.files_references.include?(file)
      target.source_build_phase.add_file_reference(file)
      puts "Added Empty.swift to #{target.name} compile sources phase."
    end
  end
  target.build_configurations.each do |config|
    config.build_settings['SWIFT_VERSION'] = '5.0'
    config.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'YES'
  end
end
project.save
puts "Project saved successfully."
