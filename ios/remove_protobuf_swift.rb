require 'xcodeproj'

# Remove Protobuf Swift files from the Pods Xcode project
pods_project = Xcodeproj::Project.open('Pods/Pods.xcodeproj')

swift_files_to_remove = [
  'GPBUnknownField+Additions.swift',
  'GPBUnknownFields+Additions.swift'
]

# Remove from all targets' build phases first
pods_project.targets.each do |target|
  next unless target.name == 'Protobuf'
  puts "Processing Protobuf target..."
  target.source_build_phase.files.select { |bf|
    swift_files_to_remove.any? { |name| bf.display_name == name }
  }.each do |build_file|
    puts "Removing build file: #{build_file.display_name}"
    build_file.remove_from_project
  end
end

# Remove from file references
pods_project.files.select { |f|
  swift_files_to_remove.include?(File.basename(f.path.to_s))
}.each do |file_ref|
  puts "Removing file reference: #{file_ref.path}"
  file_ref.remove_from_project
end

pods_project.save
puts "Done removing Swift files from Pods project."
