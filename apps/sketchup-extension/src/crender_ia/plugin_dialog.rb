# frozen_string_literal: true

module CRenderIA
  # Keeps a single plugin window: without it every menu click would open another dialog.
  class PluginDialog
    OPTIONS = {
      dialog_title: 'C.Render IA',
      preferences_key: 'com.crenderia.plugin',
      scrollable: true,
      resizable: true,
      width: 480,
      height: 640,
      min_width: 360,
      min_height: 480
    }.freeze

    def initialize(html_path:, dialog_class: UI::HtmlDialog)
      @html_path = html_path
      @dialog_class = dialog_class
      @dialog = nil
    end

    def show
      if @dialog&.visible?
        @dialog.bring_to_front
      else
        @dialog = build_dialog
        @dialog.show
      end
    end

    private

    def build_dialog
      dialog = @dialog_class.new(OPTIONS)
      dialog.set_file(@html_path)
      dialog
    end
  end
end
