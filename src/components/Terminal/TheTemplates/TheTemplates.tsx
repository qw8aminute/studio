import { useMemo, useState } from "react"
import {
  animated,
  config,
  useChain,
  useSpring,
  useSpringRef,
  useTransition,
} from "@react-spring/web"

import styles from "./TheTemplates.module.css"
import { TEMPLATE_CARDS } from "./data"
import type { TemplateCard, TemplateId } from "./data"

type View = { kind: "grid" } | { kind: "detail"; id: TemplateId }

export default function TheTemplates() {
  const [view, setView] = useState<View>({ kind: "grid" })

  const active = useMemo(() => {
    if (view.kind !== "detail") return null
    return TEMPLATE_CARDS.find((c) => c.id === view.id) ?? null
  }, [view])

  const isDetail = view.kind === "detail"

  // 1) Shell spring (container morph)
  const shellApi = useSpringRef()
  const shell = useSpring({
    ref: shellApi,
    config: config.stiff,
    from: { scale: 0.98, opacity: 0, y: 8 },
    to: {
      scale: 1,
      opacity: 1,
      y: 0,
    },
  })

  // 2) Items transition (cards or examples)
  const itemsApi = useSpringRef()
  const items = isDetail ? (active?.examples ?? []) : TEMPLATE_CARDS

  const transition = useTransition(items, {
    ref: itemsApi,
    keys: (item: any) => item.id,
    trail: 55,
    from: { opacity: 0, transform: "translateY(10px) scale(0.98)" },
    enter: { opacity: 1, transform: "translateY(0px) scale(1)" },
    leave: { opacity: 0, transform: "translateY(6px) scale(0.98)" },
    config: config.gentle,
  })

  useChain([shellApi, itemsApi], [0, 0.12])

  const openCard = (id: TemplateId) => setView({ kind: "detail", id })
  const back = () => setView({ kind: "grid" })

  return (
    <animated.div
      className={styles.root}
      style={{
        opacity: shell.opacity,
        transform: shell.y.to((y) => `translateY(${y}px) scale(${shell.scale.get()})`),
      }}
    >
      <div className={styles.topRow}>
        <div className={styles.kicker}>DATA · DECKS · DEMOS</div>

        {isDetail ? (
          <button className={styles.backBtn} onClick={back}>
            ← BACK
          </button>
        ) : (
          <div className={styles.hint}>click a card</div>
        )}
      </div>

      {!isDetail && (
        <div className={styles.grid}>
          {transition((animStyle, item) => {
            const card = item as TemplateCard
            return (
              <animated.button
                type="button"
                className={styles.card}
                style={animStyle as any}
                onClick={() => openCard(card.id)}
              >
                <div className={styles.cardFill} style={{ background: card.accent }} />
                <div className={styles.cardInner}>
                  <div className={styles.cardTitle}>{card.title}</div>
                  <div className={styles.cardSubtitle}>{card.subtitle}</div>
                  <div className={styles.cardBlurb}>{card.blurb}</div>

                  <div className={styles.cardMeta}>
                    <span className={styles.pill}>{card.examples.length} examples</span>
                    <span className={styles.pill}>light + dark</span>
                  </div>
                </div>
              </animated.button>
            )
          })}
        </div>
      )}

      {isDetail && active && (
        <div className={styles.detail}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.detailTitle}>{active.title}</div>
              <div className={styles.detailSub}>{active.subtitle}</div>
            </div>

            <div className={styles.detailActions}>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  // stub: wire theme toggle later
                  // eslint-disable-next-line no-console
                  console.log("toggle theme")
                }}
              >
                TOGGLE THEME
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => {
                  // stub: wire external links later
                  // eslint-disable-next-line no-console
                  console.log("open example")
                }}
              >
                OPEN
              </button>
            </div>
          </div>

          <div className={styles.examples}>
            {transition((animStyle, item) => (
              <animated.div className={styles.exampleRow} style={animStyle as any}>
                <div className={styles.exampleDot} />
                <div className={styles.exampleText}>
                  <div className={styles.exampleTitle}>{(item as any).title}</div>
                  <div className={styles.exampleDesc}>{(item as any).description}</div>
                </div>
              </animated.div>
            ))}
          </div>

          <div className={styles.detailFooter}>
            <div className={styles.footerNote}>
              Next: wire DATA to iframe, DECKS to HTML renderer, DEMOS to YouTube embeds.
            </div>
          </div>
        </div>
      )}
    </animated.div>
  )
}
