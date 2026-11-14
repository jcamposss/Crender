# frozen_string_literal: true

require 'minitest/autorun'

module CRenderIA
  # Stands in for UI::HtmlDialog, which only exists inside SketchUp.
  class FakeHtmlDialog
    class << self
      def instances
        @instances ||= []
      end

      def new(*args)
        super.tap { |dialog| instances << dialog }
      end
    end

    attr_reader :options, :file, :show_count, :bring_to_front_count

    def initialize(options)
      @options = options
      @show_count = 0
      @bring_to_front_count = 0
      @visible = false
    end

    def set_file(path) # rubocop:disable Naming/AccessorMethodName -- mirrors the SketchUp API
      @file = path
    end

    def show
      @show_count += 1
      @visible = true
    end

    def bring_to_front
      @bring_to_front_count += 1
    end

    def visible?
      @visible
    end

    def close_by_user
      @visible = false
    end
  end
end
