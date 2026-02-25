require 'xcodeproj'
project_path = 'Choona.xcodeproj'
project = Xcodeproj::Project.open(project_path)

project.targets.each do |target|
  target.build_configurations.each do |config|
    config.build_settings['EAGER_LINKING'] = 'NO'
    config.build_settings['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOLS'] = 'NO'
  end
end

project.save
puts "Disabled Eager Linking and Swift Asset Generation"
