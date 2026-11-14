# frozen_string_literal: true

require 'sketchup'
require_relative 'plugin_dialog'

# Extension entry point: adds the menu item that opens the plugin dialog.
module CRenderIA
  def self.plugin_dialog
    @plugin_dialog ||= PluginDialog.new(html_path: File.join(__dir__, 'ui', 'index.html'))
  end

  unless file_loaded?(__FILE__)
    UI.menu('Extensions').add_item('C.Render IA') { plugin_dialog.show }
    file_loaded(__FILE__)
  end
end
