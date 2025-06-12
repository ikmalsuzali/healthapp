import type { MDXComponents } from "mdx/types"

import { Bold, CustomLink, H1, H2, H3, P, Ul } from "@/components/mdx"

let customComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  Bold: Bold,
  ul: Ul,
  a: CustomLink,
}

export function useMDXComponents(components: MDXComponents) {
  return {
    ...customComponents,
    ...components,
  }
}
