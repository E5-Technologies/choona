require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)
file_ref = project.main_group.find_subpath(File.join('Choona', 'Empty.swift'), true)
unless file_ref.is_a?(Xcodeproj::Project::Object::PBXFileReference)
  file_ref = project.main_group.new_reference(File.join('Choona', 'Empty.swift'))
end

project.targets.each do |target|
  if target.respond_to?(:source_build_phase)
    unless target.source_build_phase.files_references.include?(file_ref)
      target.source_build_phase.add_file_reference(file_ref)
      puts "Added to #{target.name}"
    end
  end
end
project.save
puts "Saved fix"
