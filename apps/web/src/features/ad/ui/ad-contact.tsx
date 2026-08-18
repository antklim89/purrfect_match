import type { ReactNode } from 'react';
import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { FaViber } from 'react-icons/fa6';
import { RiKakaoTalkLine, RiPhoneLine, RiTelegram2Line, RiWechatLine, RiWhatsappLine } from 'react-icons/ri';

import { Item, ItemContent, ItemMedia, ItemTitle } from '@/shared/ui/item';
import { Separator } from '@/shared/ui/separator';

const contactsMap: Record<string, { icon: ReactNode; hrefPrefix: string }> = {
  phone: { icon: <RiPhoneLine />, hrefPrefix: 'tel:+' },
  whatsapp: { icon: <RiWhatsappLine />, hrefPrefix: 'https://wa.me/' },
  telegram: { icon: <RiTelegram2Line />, hrefPrefix: 'tg://resolve?domain=' },
  viber: { icon: <FaViber />, hrefPrefix: 'viber://chat?number=+' },
  wechat: { icon: <RiWechatLine />, hrefPrefix: 'weixin://dl/chat?' },
  kakaotalk: { icon: <RiKakaoTalkLine />, hrefPrefix: 'kakaotalk://chat?chat_id=' },
};

export function AdContact({ contact }: { contact: ContactType }) {
  const contactData = contactsMap[contact.type];

  return (
    <Item
      variant="outline"
      key={contact.type + contact.number}
      render={
        <a
          aria-label={contact.type}
          className="text-blue-400 hover:blue-200"
          href={contactData && `${contactData.hrefPrefix ?? ''}${contact.number}`}
        />
      }
    >
      <ItemMedia className="[&_svg]:size-6">{contactData?.icon ?? <RiPhoneLine />}</ItemMedia>
      <Separator orientation="vertical" />
      <ItemTitle className="uppercase">{contact.type}</ItemTitle>
      <Separator orientation="vertical" />
      <ItemContent>{contact.number}</ItemContent>
    </Item>
  );
}
