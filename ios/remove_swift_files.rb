require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)

swift_files_to_remove = ['AuthorizationManager.swift', 'AppleUserToken.swift', 'SharedClass.swift', 'AppleMusicManager.swift', 'Empty.swift']

project.targets.each do |target|
  if target.respond_to?(:source_build_phase)
    target.source_build_phase.files_references.each do |file_ref|
      if file_ref && file_ref.path && swift_files_to_remove.include?(File.basename(file_ref.path))
        target.source_build_phase.remove_file_reference(file_ref)
        puts "Removed #{file_ref.path} from #{target.name}"
      end
    end
  end
end

project.save
puts "Removed all Swift files from build phase"
