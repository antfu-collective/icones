import type { KElement } from '@sekiso/core/view'
import type { icons } from '../schema'
import { Icon as AnyIcon } from '@sekiso/core/view'

/** An icon the schema declares, so every theme is sure to have artwork for it. */
export const Icon: (props: { name: (typeof icons)[number] }) => KElement = AnyIcon
