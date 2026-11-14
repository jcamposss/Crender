# frozen_string_literal: true

require_relative 'test_helper'
require_relative '../src/crender_ia/plugin_dialog'

module CRenderIA
  class PluginDialogTest < Minitest::Test
    HTML_PATH = File.join('ui', 'index.html')

    def setup
      FakeHtmlDialog.instances.clear
      @plugin_dialog = PluginDialog.new(html_path: HTML_PATH, dialog_class: FakeHtmlDialog)
    end

    def test_first_show_opens_a_dialog_with_the_bundled_ui
      @plugin_dialog.show

      dialog = FakeHtmlDialog.instances.fetch(0)
      assert_equal HTML_PATH, dialog.file
      assert_equal 'C.Render IA', dialog.options[:dialog_title]
      assert_equal 1, dialog.show_count
    end

    def test_showing_while_open_brings_the_same_dialog_to_front
      @plugin_dialog.show
      @plugin_dialog.show

      assert_equal 1, FakeHtmlDialog.instances.size
      assert_equal 1, FakeHtmlDialog.instances.first.bring_to_front_count
    end

    def test_showing_after_the_user_closed_it_opens_a_fresh_dialog
      @plugin_dialog.show
      FakeHtmlDialog.instances.first.close_by_user
      @plugin_dialog.show

      assert_equal 2, FakeHtmlDialog.instances.size
      assert_equal 1, FakeHtmlDialog.instances.last.show_count
    end
  end
end
