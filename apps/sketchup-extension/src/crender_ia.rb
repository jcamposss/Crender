# frozen_string_literal: true

require 'sketchup'
require 'extensions'
require_relative 'crender_ia/version'

# Registers the extension; SketchUp loads crender_ia/main only while it is enabled.
module CRenderIA
  EXTENSION = SketchupExtension.new('C.Render IA', File.join(__dir__, 'crender_ia', 'main'))
  EXTENSION.version = VERSION
  EXTENSION.creator = 'C.Render IA'
  EXTENSION.description = 'Render com IA a partir da vista do modelo, dentro do SketchUp.'
  Sketchup.register_extension(EXTENSION, true)
end
