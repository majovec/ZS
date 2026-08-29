import React from 'react'
import { colors, spacing } from '@/theme/colors'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export const AboutSecretScreen: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
        overflowY: 'auto',
      }}
    >
      <Button
        variant="secondary"
        onClick={onClose}
        style={{
          marginBottom: spacing.lg,
        }}
      >
        ← Zpět
      </Button>

      <Card
        style={{
          padding: spacing.lg,
          marginBottom: spacing.lg,
        }}
      >
        <h1
          style={{
            color: colors.gold,
            marginBottom: spacing.md,
            fontSize: '24px',
          }}
        >
          🎉 Gratuluji, našel jsi tajnou stránku!
        </h1>

        <div
          style={{
            lineHeight: '1.8',
            color: colors.textPrimary,
            fontSize: '14px',
          }}
        >
          <p>
            Když už jsi došel až sem, chci ti ukázat trochu nefiltrovaného
            zákulisí.
          </p>

          <p style={{ marginTop: spacing.md }}>
            <strong>Jmenuji se Jakub</strong> a jsem jeden z vás. Člověk, který
            má taky dluhy a rozhodl se s nimi konečně něco udělat. Když jsem v
            srpnu 2026 dělal téhle aplikaci její finální podobu, byl jsem už
            dva měsíce doslova na ulici. Přišel jsem o ubytování od agentury a
            mým domovem se staly ulice Prahy.
          </p>

          <p style={{ marginTop: spacing.md }}>
            Původně měl být projekt hotový už v červenci. Vývoj ale zásadně
            zbrzdil fakt, že jsem komplet celý zdrojový kód psal jen na
            mobilním telefonu. Po večerech i přes den, na Hlavním nádraží, na
            letišti, na Václaváku… Kdekoliv, kde bylo trochu klidu a světla.
          </p>

          <p style={{ marginTop: spacing.md }}>
            Dělal jsem to s jediným cílem – vytvořit něco, co vám pomůže. Jsem
            důkaz toho, že i když je člověk na úplném dně, pořád v sobě může
            najít motivaci fungovat a tvořit.
          </p>

          <div
            style={{
              marginTop: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.blackCard,
              borderLeft: `4px solid ${colors.gold}`,
              borderRadius: '4px',
            }}
          >
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '16px' }}>
              <strong>Proto ti chci říct jedno:</strong>
            </p>
            <p style={{ margin: `${spacing.md} 0 0`, fontSize: '15px' }}>
              Nevzdávej to. Bojuj. Bez ohledu na to, v jaké situaci se teď
              nacházíš, věřím, že se z toho dostaneš a jednou ti bude dobře.
            </p>
          </div>

          <p style={{ marginTop: spacing.lg, marginBottom: 0 }}>
            Díky, že tu aplikaci používáš.
          </p>

          <p
            style={{
              marginTop: spacing.lg,
              paddingTop: spacing.lg,
              borderTop: `1px solid ${colors.border}`,
              color: colors.textSecondary,
              fontSize: '12px',
            }}
          >
            Vytvořeno se záměrem pomáhat lidem znovu se postavit na nohy.
            <br />
            Finance pod kontrolou • Projekt @znovusilnejsi
          </p>
        </div>
      </Card>

      <Button fullWidth onClick={onClose} style={{ marginBottom: spacing.lg }}>
        Zavřít
      </Button>
    </div>
  )
}
