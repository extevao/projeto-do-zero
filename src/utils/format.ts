import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formataData(date: string): string {
  return format(new Date(date), 'd LLL yyyy', {
    locale: ptBR,
  });
}
