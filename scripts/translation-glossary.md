# Translation glossary

Names, fixed phrases and tone for the Spanish and French drafts made by `/translate`.
A reviewer (Thibault or the marketing lead) can edit this file without a developer: keep
the table format. `scripts/translation-memory.json` holds exact English sentences with their
approved translation; this file holds the terms and rules the assistant applies everywhere else.

Rows marked **guess** were inferred, not approved. Please confirm or correct them.

## Tone

| | Register | Source |
|---|---|---|
| Spanish | Informal **tú** ("Tu expedición", "Planifica tu expedición", "Toca un barco…") | translation-memory.json, hero and funnel text |
| French | Formal **vous** ("Votre expédition", "Personnalisez votre expédition") | translation-memory.json, hero and funnel text |

Warm, direct, calm. No exclamation marks unless the English has one. Keep headings and buttons about as long as the English.

## Do not translate

| Term | Notes |
|---|---|
| Eagle Ray Expeditions, Eagle Ray | Company name |
| Go Sailing | Button label kept in English in all languages (translation memory) |
| Crew names: Mohamed "Adly", Alexis, Ana, Antoine, Benji, Javier, Juan Carlos, Lou Lombardi, Monik Saab, Roberto, Sergio Torres "Canei", Thibault | People's names (also marked `doNotTranslate` in the editor) |
| Boat names: Bay Dreamer, Beneteau Sense 55, Olympia, Sun Odyssey 44i - Jeanneau | Boat names |
| La Paz, Baja California Sur (BCS), Espíritu Santo, Los Islotes | Place names. French "Basse-Californie du Sud" is used in long form (translation memory) |
| WhatsApp, Instagram, Starlink, PADI, Ironman, Survivor México | Brands and titles |
| Chef Gold, Chef Silver | Kept as in the memory |

## Fixed phrases

| English | Español | Français | Notes |
|---|---|---|---|
| Passionate Sea People | Gente del mar apasionada | Des gens de la mer passionnés | Menu label. Headlines use "apasionados del mar" / "passionnés de la mer" |
| Sea of Cortez | Mar de Cortés | mer de Cortez | Spanish capitalises "Mar"; French "mer de Cortez" (hero text) |
| Expedition | Expedición | Expédition | |
| Expedition Leader | Líder de expedición | Chef d'expédition | The memory also has "Líder de Expedición" and "Leader d'expédition" for the label alone. **guess:** prefer the lowercase forms in running text |
| Your expedition | Tu expedición | Votre expédition | |
| Customize your expedition | Personaliza tu expedición | Personnalisez votre expédition | |
| Anchorage | Fondeadero | Mouillage | Depth gauge label |
| Private catamaran / private boat | Catamarán privado / barco privado | Catamaran privé / bateau privé | |
| Crew | Tripulación | Équipage | |
| Boats | Barcos | Bateaux | Menu label |
| Contact us | Contáctanos | Nous contacter | Menu label |
| About us | Quiénes somos | À propos de nous | Menu label |
| Sail with us | Navega con nosotros | Venez naviguer avec nous | Menu label |
| Freediving | Buceo libre | Plongée en apnée | |
| Spearfishing | Pesca submarina | Pêche sous-marine | |
| Scuba diving | Buceo con tanque | Plongée bouteille | **guess** |
| Sea lions | Lobos marinos | Otaries | **guess** |
| Thanksgiving | Acción de Gracias | Thanksgiving | Spanish from the live landing page; French keeps the English word |

## Open questions

- Confirm "Líder de expedición" vs "Jefe de expedición" (the live Sergio page uses "jefe de expedición").
- Confirm French "Chef d'expédition" vs "Leader d'expédition" (both appear today).
- Should "Go Sailing" stay in English in Spanish and French?
